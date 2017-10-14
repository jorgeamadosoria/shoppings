var express = require('express');
var _ = require("underscore");
var moment = require('moment');
var itemService = require('../services/item');
var listService = require('../services/list');
var service = require('../services/reports');
var lists = require('../data/lists');

var router = express.Router();

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/monthly', lists.isLoggedIn, function(req, res, next) {

    listService.list().then(function(docs) {
        data = {};
        data.lists = listService.listsObject(docs);
        data.currencies = lists.stripNAorNull(data.lists.currencies);
        res.render("reports/monthly", data);
    });
});

router.get('/mreport', lists.isLoggedIn, function(req, res, next) {
    data = {};
    data.currency = req.query.currency;
    data.month = req.query.month;
    var categoriesPromise = service.categoriesChart(req.query.currency, req.query.month).then(obj => data.categoriesChart = obj, handleError);
    var reasonsPromise = service.reasonsChart(req.query.currency, req.query.month).then(obj => data.reasonsChart = obj, handleError);
    var monthlyTotalPromise = service.monthlyTotal(req.query.currency, req.query.month).then(obj => data.monthlyTotal = obj[0].total, handleError);
    var dailyTotalPromise = service.dailyTotal(req.query.currency, req.query.month).then(obj => data.dailyTotal = obj, handleError);
    var addressPromise = service.topAddresses(req.query.currency, req.query.month).then(obj => data.topAddresses = obj, handleError);
    var itemsPromise = service.itemList(req.query.currency, req.query.month).then(obj => data.items = obj, handleError);
    Promise.all([categoriesPromise, reasonsPromise, addressPromise, itemsPromise, dailyTotalPromise, monthlyTotalPromise]).then(function(obj) {
        data.dailyTotal = _.sortBy(data.dailyTotal, e => moment(e._id.value).utc());

        var days = moment(data.dailyTotal[1]._id.value).daysInMonth();
        data.dailyTotal = _.map(data.dailyTotal, function(e) {
            return { _id: { value: moment(e._id.value).utc().date() }, total: e.total };
        });

        var dailyTotalTemp = new Array(days + 1);
        _.each(data.dailyTotal, e => dailyTotalTemp[e._id.value] = e);
        _.each(dailyTotalTemp, e => console.log(e));
        data.dailyTotal = _.map(dailyTotalTemp, function(e, i) {
            if (!e) return { _id: { value: i }, total: 0 };
            else return e;
        }).slice(1, days + 1);

        data.categoriesChart10 = [];
        if (data.categoriesChart10.length < 10) {
            for (i = 0; i < 10; i++)
                if (i < data.categoriesChart.length)
                    data.categoriesChart10.push(data.categoriesChart[i]);
                else
                    data.categoriesChart10.push({ _id: { value: "-" }, total: "-" });
        }

        data.reasonsChart10 = [];
        if (data.reasonsChart10.length < 10) {
            for (i = 0; i < 10; i++)
                if (i < data.reasonsChart.length)
                    data.reasonsChart10.push(data.reasonsChart[i]);
                else
                    data.reasonsChart10.push({ _id: { value: "-" }, total: "-" });
        }

        data.topItems = _.sortBy(data.items, e => e.totalItemCost * -1);
        data.topItems = _.filter(data.topItems, (e, i) => i < 10);
        data.dayMax = _.max(data.dailyTotal, e => e.total).total;
        data.monthlyMedian = lists.median(_.map(data.dailyTotal, e => moment(e.total).utc()));
        data.monthlyAvg = _.reduce(data.dailyTotal, function(memo, num) { return memo + num.total; }, 0);
        data.monthlyAvg /= data.dailyTotal.length;
        res.locals = data;
        res.render("reports/mreport", {
            layout: false
        });
    });
});
module.exports = router;