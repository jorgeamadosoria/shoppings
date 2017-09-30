var express = require('express');
var _ = require("underscore");
var moment = require('moment');
var service = require('../services/charts');

var router = express.Router();

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/categoriesChart', function(req, res, next) {
    service.categoriesChart().then(function(obj) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
    }, handleError);
});

module.exports = router;