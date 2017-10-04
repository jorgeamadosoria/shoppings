var express = require('express');
var _ = require("underscore");
var moment = require('moment');
var lists = require('../data/lists');
var service = require('../services/item');
var brandService = require('../services/brand');
var addressService = require('../services/address');

var router = express.Router();

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};


router.get('/', function(req, res, next) {
    var data = {};
    var brandPromise = brandService.list().then(docs => data.brands = docs);
    var monthlyPromise = service.monthlyList().then(docs => data.monthlyTags = lists.stripNAorNull(docs));
    var addressPromise = addressService.list().then(docs => data.addresses = docs);

    var itemListPromise = service.list({ "date": { "name": "date", "fields": [{ "key": "from", "value": new moment().format("YYYY-MM-DD") }] } }).then(docs => data.list = docs);

    Promise.all([brandPromise, addressPromise, monthlyPromise, itemListPromise]).then(function(obj) {
        data.categories = lists.categories;
        data.reasons = lists.reasons;
        data.units = lists.units;
        data.monthly = lists.monthly;
        data.types = lists.types;
        data.status = lists.status;
        data.currencies = lists.currencies;
        //   console.log(data.list);
        console.log(JSON.stringify(data.monthly));
        res.render("index", data);
    }, handleError);
});




module.exports = router;