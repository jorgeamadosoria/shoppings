var express = require('express');
var _ = require("underscore");
var moment = require('moment');
var service = require('../services/charts');

var router = express.Router();

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/list', function(req, res, next) {
    res.render("charts/list");
});


router.get('/categoriesChart', function(req, res, next) {
    console.log(req.query.currency);
    service.categoriesChart(req.query.currency).then(function(obj) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
    }, handleError);
});

module.exports = router;