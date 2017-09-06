var express = require('express');
var _ = require("underscore");
var moment = require('moment');
var Item = require('../data/item');
var lists = require('../data/lists');
var service = require('../services/item');
var brandService = require('../services/brand');
var addressService = require('../services/address');

var router = express.Router();

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/list', function(req, res, next) {
    var data = {};
    var brandPromise = brandService.list().then(docs => data.brands = docs);
    var addressPromise = addressService.list().then(docs => data.addresses = docs);

    var itemListPromise = service.list().then(docs => data.list = docs);

    Promise.all([brandPromise, addressPromise, itemListPromise]).then(function(obj) {
        //    console.log(_.filter(_.map(searchItem.schema.paths, k => { return { path: k.path, type: k.instance }; }), v => !v.path.startsWith("_")));
        //    data.searchObjs = itemSchema.toSearchObject();

        data.searchObjs = new Item().toSearchObject();
        data.categories = lists.categories;
        data.reasons = lists.reasons;
        data.units = lists.units;
        data.types = lists.types;
        data.status = lists.status;
        data.currencies = lists.currencies;
        res.render("items/list", data);
    }, handleError);
});

router.get('/detail/:id', function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(obj));
    }, handleError);
});

router.delete('/:id', function(req, res, next) {
    service.delete(req.params.id).then(function(obj) {
        res.sendStatus(200).end();
    }, handleError());

});

router.get('/form', function(req, res, next) {
    var data = {};
    var brandPromise = brandService.list()
        .then(docs => data.brands = docs);
    var addressPromise = addressService.list()
        .then(docs => data.addresses = docs);

    var promises = [brandPromise, addressPromise];
    if (req.query.id) {
        var findPromise = service.findById(req.query.id).then(function(obj) {
            data.obj = obj;
            data.categories = lists.prepare(lists.categories, obj.category);
            data.reasons = lists.prepare(lists.reasons, obj.reason);
            data.units = lists.prepare(lists.units, obj.unit);
            data.types = lists.prepare(lists.types, obj.type);
            data.currencies = lists.prepare(lists.currencies, obj.currency);
        }).catch(handleError);
        promises.push(findPromise);
    } else {

        data.categories = lists.categories;
        data.reasons = lists.reasons;
        data.units = lists.units;
        data.types = lists.types;
        data.currencies = lists.currencies;

    }

    Promise.all(promises).then(function() {
        if (data.obj) {
            //   console.log(data.brands);
            data.brands = lists.prepareObj(data.brands, data.obj.brand);
            //     console.log(data.brands);
            //     console.log(data.obj.address);
            data.addresses = lists.prepareObj(data.addresses, data.obj.address);

        }
        //  console.log(JSON.stringify(data.obj.brand));

        res.render("items/form", data);
    });

});

router.post(['/list'], function(req, res, next) {
    
        if (req.body.id) {
            console.log(JSON.stringify(req.body));
    
            service.update(req.body.id, req.body).then(function(obj) {
                res.redirect("/");
            }, handleError);
        } else
            service.insert(req.body).then(function(obj) {
                res.redirect("/");
            }, handleError);
    
    
    });

module.exports = router;