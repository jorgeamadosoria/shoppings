var express = require('express');
var _ = require("underscore");
var moment = require('moment');
var lists = require('../data/lists');
var service = require('../services/item');
var listService = require('../services/list');
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
    var listPromise = listService.list().then(docs => data.lists = listService.listsObject(docs));

    var itemListPromise = service.list({ "date": { "name": "date", "fields": [{ "key": "from", "value": new moment().format("YYYY-MM-DD") }] } }).then(docs => data.list = docs);

    Promise.all([brandPromise, addressPromise, monthlyPromise, listPromise, itemListPromise]).then(function(obj) {
        data.categories = data.lists.categories;
        data.reasons = data.lists.reasons;
        data.units = data.lists.units;
        data.monthly = data.lists.monthly;

        tempMonthlyTags = [];
        _.each(data.monthly, function(e) {
            if (!_.find(data.monthlyTags, function(e2) {
                    return e2._id == e;
                })) {
                tempMonthlyTags.push({ _id: e, lastDate: null });
            }
        });
        console.log(tempMonthlyTags);
        data.monthlyTags = data.monthlyTags.concat(tempMonthlyTags);
        console.log(data.monthlyTags);

        data.types = data.lists.types;
        data.currencies = data.lists.currencies;
        //  console.log(JSON.stringify(data.monthly));
        res.render("index", data);
    }, handleError);
});




module.exports = router;