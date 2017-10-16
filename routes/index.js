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



router.get('/login', function(req, res) {
    res.render('login', { layout: false });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/', lists.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    var brandPromise = brandService.list().then(docs => res.locals.brands = docs);
    var monthlyPromise = service.monthlyList().then(docs => res.locals.monthlyTags = lists.stripNAorNull(docs));
    var addressPromise = addressService.list().then(docs => res.locals.addresses = docs);
    var listPromise = listService.list().then(docs => res.locals.lists = listService.listsObject(docs));

    var itemListPromise = service.list({ "date": { "name": "date", "fields": [{ "key": "from", "value": new moment().format("YYYY-MM-DD") }] } }).then(docs => res.locals.list = { docs: docs });

    Promise.all([brandPromise, addressPromise, monthlyPromise, listPromise, itemListPromise]).then(function(obj) {
        res.locals.categories = res.locals.lists.categories;
        res.locals.reasons = res.locals.lists.reasons;
        res.locals.units = res.locals.lists.units;
        res.locals.monthly = res.locals.lists.monthly;

        tempMonthlyTags = [];
        _.each(res.locals.monthly, function(e) {
            if (!_.find(res.locals.monthlyTags, function(e2) {
                    return e2._id == e;
                })) {
                tempMonthlyTags.push({ _id: e, lastDate: null });
            }
        });
        res.locals.monthlyTags = res.locals.monthlyTags.concat(tempMonthlyTags);

        res.locals.types = res.locals.lists.types;
        res.locals.currencies = res.locals.lists.currencies;
        res.render("index");
    }, handleError);
});




module.exports = router;