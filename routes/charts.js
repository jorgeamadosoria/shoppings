var express = require('express');
var _ = require("underscore");
var moment = require('moment');
var service = require('../services/charts');
var lists = require('../data/lists');

var router = express.Router();

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/monthly', function(req, res, next) {
    data = {};
    data.currencies = lists.effectiveCurrencies;
    res.render("charts/monthly", data);
});

router.get('/historical', function(req, res, next) {
    data = {};
    data.currencies = lists.effectiveCurrencies;
    res.render("charts/historical", data);
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