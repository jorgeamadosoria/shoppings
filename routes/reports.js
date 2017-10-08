var express = require('express');
var _ = require("underscore");
var moment = require('moment');
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

router.get('/historical', function(req, res, next) {
    listService.list().then(function(docs) {
        data = {};
        data.lists = listService.listsObject(docs);
        data.currencies = lists.stripNAorNull(data.lists.currencies);
        res.render("reports/historical", data);
    });
});



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

module.exports = router;