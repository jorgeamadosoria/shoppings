var express = require('express');
var _ = require("underscore");
var Item = require('../data/item');
var lists = require('../data/lists');
var service = require('../services/item');
var brandService = require('../services/brand');
var addressService = require('../services/address');

var queryService = require('../services/query');

var router = express.Router();

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/list', function(req, res, next) {
    var data = {};
    var brandPromise = brandService.list().then(docs => data.brands = docs);
    var addressPromise = addressService.list().then(docs => data.addresses = docs);
    var monthlyPromise = service.monthlyList().then(docs => data.monthly = docs);
    var queryPromise = queryService.list().then(docs => data.queries = docs);


    Promise.all([brandPromise, addressPromise, monthlyPromise, queryPromise]).then(function(obj) {
        data.searchObjs = new Item().toSearchObject();
        data.categories = lists.categories;
        data.reasons = lists.reasons;
        data.monthly = lists.monthly;
        data.units = lists.units;
        data.types = lists.types;
        data.status = lists.status;
        data.currencies = lists.currencies;
        res.render("items/list", data);
    }, handleError);
});

router.post('/search', function(req, res, next) {

    var data = {};
    var brandPromise = brandService.list().then(docs => data.brands = docs);
    var addressPromise = addressService.list().then(docs => data.addresses = docs);
    var monthlyPromise = service.monthlyList().then(docs => data.monthly = docs);

    var itemListPromise = service.paginate(req.body).then(docs => data.list = docs, handleError);
    Promise.all([brandPromise, addressPromise, monthlyPromise, itemListPromise]).then(function(obj) {
        data.categories = lists.categories;
        data.reasons = lists.reasons;
        data.monthly = lists.monthly;
        data.units = lists.units;
        data.types = lists.types;
        data.status = lists.status;
        data.currencies = lists.currencies;
        res.locals = data;
        res.render("items/search", {
            layout: false
        });
    }, handleError);

});


router.get('/detail/:id', function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
    }, handleError);
});

router.delete('/:id', function(req, res, next) {
    service.delete(req.params.id).then(function(obj) {
        res.sendStatus(200).end();
    }, handleError);
});

router.get('/form', function(req, res, next) {
    var data = {};
    var brandPromise = brandService.list().then(docs => data.brands = docs);
    var addressPromise = addressService.list().then(docs => data.addresses = docs);
    var monthlyPromise = service.monthlyList().then(docs => data.monthly = docs);

    var promises = [brandPromise, addressPromise, monthlyPromise];
    if (req.query.id) {
        var findPromise = service.findById(req.query.id).then(function(obj) {
            data.obj = obj;
            data.categories = lists.prepare(lists.categories, obj.category);
            data.reasons = lists.prepare(lists.reasons, obj.reason);
            data.monthly = lists.prepare(lists.monthly, obj.monthly);
            data.units = lists.prepare(lists.units, obj.unit);
            data.types = lists.prepare(lists.types, obj.type);
            data.currencies = lists.prepare(lists.currencies, obj.currency);
        }).catch(handleError);
        promises.push(findPromise);
    } else {

        data.categories = lists.categories;
        data.reasons = lists.reasons;
        data.monthly = lists.monthly;
        data.units = lists.units;
        data.types = lists.types;
        data.currencies = lists.currencies;

    }

    Promise.all(promises).then(function() {
        if (data.obj) {
            data.brands = lists.prepareObj(data.brands, data.obj.brand);
            data.addresses = lists.prepareObj(data.addresses, data.obj.address);
            data.monthly = lists.prepareObj(data.monthly, data.obj.monthly);
        }

        res.render("items/form", data);
    });

});

router.post('/update', function(req, res, next) {
    if (req.body.id) {
        service.update(req.body.id, req.body).then(function(obj) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(obj));
        }, handleError);
    } else
        service.insert(req.body).then(function(obj) {
            res.sendStatus(200).end();
        }, handleError);

});

module.exports = router;