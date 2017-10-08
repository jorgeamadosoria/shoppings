var express = require('express');
var _ = require("underscore");
var Item = require('../data/item');
var lists = require('../data/lists');
var service = require('../services/item');
var listService = require('../services/list');
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
    var listPromise = listService.list().then(docs => data.lists = listService.listsObject(docs));
    var monthlyPromise = service.monthlyList().then(docs => data.monthly = docs);
    var queryPromise = queryService.list().then(docs => data.queries = docs);


    Promise.all([brandPromise, addressPromise, monthlyPromise, listPromise, queryPromise]).then(function(obj) {
        data.searchObjs = new Item().toSearchObject();
        data.categories = data.lists.categories;
        data.reasons = data.lists.reasons;
        data.monthly = data.lists.monthly;
        data.units = data.lists.units;
        data.types = data.lists.types;
        data.status = data.lists.status;
        data.currencies = data.lists.currencies;
        res.render("items/list", data);
    }, handleError);
});

router.post('/search', function(req, res, next) {

    var data = {};
    var brandPromise = brandService.list().then(docs => data.brands = docs);
    var addressPromise = addressService.list().then(docs => data.addresses = docs);
    var monthlyPromise = service.monthlyList().then(docs => data.monthly = docs);
    var listPromise = listService.list().then(docs => data.lists = listService.listsObject(docs));

    var itemListPromise = service.paginate(req.body).then(docs => data.list = docs, handleError);
    Promise.all([brandPromise, addressPromise, monthlyPromise, listPromise, itemListPromise]).then(function(obj) {
        data.categories = data.lists.categories;
        data.reasons = data.lists.reasons;
        data.monthly = data.lists.monthly;
        data.units = data.lists.units;
        data.types = data.lists.types;
        data.currencies = data.lists.currencies;
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
    var listPromise = listService.list().then(docs => data.lists = listService.listsObject(docs));

    var promises = [brandPromise, addressPromise, listPromise, monthlyPromise];
    if (req.query.id) {
        var findPromise = service.findById(req.query.id).then(function(obj) {
            data.obj = obj;
            data.categories = lists.prepare(data.lists.categories, obj.category);
            data.reasons = lists.prepare(data.lists.reasons, obj.reason);
            data.monthly = lists.prepare(lists.monthly, obj.monthly);
            data.units = lists.prepare(data.lists.units, obj.unit);
            data.types = lists.prepare(data.lists.types, obj.type);
            data.currencies = lists.prepare(data.lists.currencies, obj.currency);
        }).catch(handleError);
        promises.push(findPromise);
    } else {

        data.categories = data.lists.categories;
        data.reasons = data.lists.reasons;
        console.log(data.reasons);
        data.monthly = data.lists.monthly;
        data.units = data.lists.units;
        data.types = data.lists.types;
        data.currencies = data.lists.currencies;

    }

    Promise.all(promises).then(function() {
        if (data.obj) {
            data.brands = lists.prepareObj(data.brands, data.obj.brand);
            data.addresses = lists.prepareObj(data.addresses, data.obj.address);
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