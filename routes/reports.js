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

router.get('/monthly', function(req, res, next) {

    listService.list().then(function(docs) {
        data = {};
        data.lists = listService.listsObject(docs);
        data.currencies = lists.stripNAorNull(data.lists.currencies);
        res.render("reports/monthly", data);
    });
});

router.get('/mreport', function(req, res, next) {
    data = {};
    data.currency = req.query.currency;
    data.month = req.query.month;
    var categoriesPromise = service.categoriesChart(req.query.currency, req.query.month).then(obj => data.categoriesChart = obj, handleError);
    var reasonsPromise = service.reasonsChart(req.query.currency, req.query.month).then(obj => data.reasonsChart = obj, handleError);
    var monthlyTotalPromise = service.monthlyTotal(req.query.currency, req.query.month).then(obj => data.monthlyTotal = obj[0].total, handleError);
    var dailyTotalPromise = service.dailyTotal(req.query.currency, req.query.month).then(obj => data.dailyTotal = obj, handleError);
    var itemsPromise = service.itemList(req.query.currency, req.query.month).then(obj => data.items = obj, handleError);
    Promise.all([categoriesPromise, reasonsPromise, itemsPromise, dailyTotalPromise,monthlyTotalPromise]).then(function(obj) {
        console.log(data.dailyTotal);
        data.dayMax = _.max(obj,e => e.total);
        res.locals = data;
        res.render("reports/mreport", {
            layout: false
        });
    });
});
/*
router.get('/categoriesChart', function(req, res, next) {
    service.categoriesChart(req.query.currency).then(function(obj) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
    }, handleError);
});

router.get('/reasonsChart', function(req, res, next) {
    service.reasonsChart(req.query.currency).then(function(obj) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
    }, handleError);
});
*/
module.exports = router;