var express = require('express');
var _ = require("underscore");
var moment = require('moment');
var itemService = require('../services/item');
var listService = require('../services/list');
var service = require('../services/reports');
var utils = require('../data/utils');

var router = express.Router();

/**
 * This function exposes the UI form for report generation to standard users and admins
 *
 */
router.get('/monthly', utils.loggedRole(["user", "admin"]), function(req, res, next) {
    listService.list().then(function(docs) {
        res.locals.error = req.query.error;
        res.locals.lists = listService.listsObject(docs);
        res.locals.currencies = utils.stripNAorNull(res.locals.lists.currencies);
        res.render("reports/monthly");
    });
});

/**
 * This function exposes the data to format a HTML report to standard users and admins. 
 * The data is meant to be massaged on the client side to generate the charts.
 * If the specified month in the query does not have data or there is any issue with the data, 
 * the user is redirected to the report generation form
 *
 */
router.get('/mreport', utils.loggedRole(["user", "admin"]), function(req, res, next) {
    res.locals.currency = req.query.currency;
    res.locals.month = req.query.month;
    promises = [];

    
    promises.push(service.categoriesChart(req.query.currency, req.query.month).then(obj => res.locals.categoriesChart = obj).catch(e => console.log(e)));
    promises.push(service.reasonsChart(req.query.currency, req.query.month).then(obj => res.locals.reasonsChart = obj).catch(e => console.log(e)));
    promises.push(service.topAddresses(req.query.currency, req.query.month).then(obj => res.locals.topAddresses = obj).catch(e => console.log(e)));
    promises.push(service.itemList(req.query.currency, req.query.month).then(obj => res.locals.items = obj).catch(e => console.log(e)));
    promises.push(service.dailyTotal(req.query.currency, req.query.month).then(obj => res.locals.dailyTotal = obj).catch(e => console.log(e)));
    promises.push(service.monthlyTotal(req.query.currency, req.query.month).then(obj => res.locals.monthlyTotal = obj[0].total).catch(e => console.log(e)));

    Promise.all(promises).then(function(obj) {
        res.locals.dailyTotal = _.sortBy(res.locals.dailyTotal, e => moment(e._id.value).utc());

        var days = moment(res.locals.dailyTotal[1]._id.value).daysInMonth();
        res.locals.dailyTotal = _.map(res.locals.dailyTotal, function(e) {
            return {
                _id: {
                    value: moment(e._id.value).utc().date()
                },
                total: e.total
            };
        });

        var dailyTotalTemp = new Array(days + 1);
        _.each(res.locals.dailyTotal, e => dailyTotalTemp[e._id.value] = e);
        _.each(dailyTotalTemp, e => console.log(e));
        res.locals.dailyTotal = _.map(dailyTotalTemp, function(e, i) {
            if (!e) return {
                _id: {
                    value: i
                },
                total: 0
            };
            else return e;
        }).slice(1, days + 1);

        res.locals.categoriesChart10 = [];
        if (res.locals.categoriesChart10.length < 10) {
            for (i = 0; i < 10; i++)
                if (i < res.locals.categoriesChart.length)
                    res.locals.categoriesChart10.push(res.locals.categoriesChart[i]);
                else
                    res.locals.categoriesChart10.push({
                        _id: {
                            value: "-"
                        },
                        total: "-"
                    });
        }

        res.locals.reasonsChart10 = [];
        if (res.locals.reasonsChart10.length < 10) {
            for (i = 0; i < 10; i++)
                if (i < res.locals.reasonsChart.length)
                    res.locals.reasonsChart10.push(res.locals.reasonsChart[i]);
                else
                    res.locals.reasonsChart10.push({
                        _id: {
                            value: "-"
                        },
                        total: "-"
                    });
        }

        res.locals.topItems = _.sortBy(res.locals.items, e => e.totalItemCost * -1);
        res.locals.topItems = _.filter(res.locals.topItems, (e, i) => i < 10);
        res.locals.dayMax = _.max(res.locals.dailyTotal, e => e.total).total;
        res.locals.monthlyMedian = utils.median(_.map(res.locals.dailyTotal, e => moment(e.total).utc()));
        res.locals.monthlyAvg = _.reduce(res.locals.dailyTotal, function(memo, num) {
            return memo + num.total;
        }, 0);
        res.locals.monthlyAvg /= res.locals.dailyTotal.length;

        res.render("reports/mreport", {
            layout: false
        });
    }, function() {
        res.locals.month = req.query.month;
        res.redirect("/reports/monthly?error=true");
    });
});

/**
 * @fileOverview Router for the monthly reports
 *
 * @requires express
 * @requires underscore
 * @requires moment
 * @requires services/list
 * @requires services/item
 * @requires services/reports
 * @requires data/utils
 * 
 * @exports module
 */
module.exports = router;