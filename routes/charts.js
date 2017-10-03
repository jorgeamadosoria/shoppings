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

router.get('/list', function(req, res, next) {
    data = {};
    data.currencies = lists.currencies;
    res.render("charts/list", data);
});


router.get('/categoriesChart', function(req, res, next) {
    console.log(req.query.currency);
    service.categoriesChart(req.query.currency).then(function(obj) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
    }, handleError);
});


router.get('/reasonsChart', function(req, res, next) {
    console.log(req.query.currency);
    service.reasonsChart(req.query.currency).then(function(obj) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
    }, handleError);
});

module.exports = router;