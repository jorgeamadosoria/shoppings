var express = require('express');
var lists = require('../data/lists');
var service = require('../services/item');
var brandService = require('../services/brand');
var addressService = require('../services/address');

var router = express.Router();

var handleError = function (err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/list', function (req, res, next) {
    service.list().then(function (obj) {
        console.log(JSON.stringify(obj));
        res.render("items/list", {
            "list": obj
        });
    }, handleError());
});

router.get('/detail/:id', function (req, res, next) {
    service.findById(req.params.id).then(function (obj) {
        res.render("items/detail", obj);
    }, handleError());
}); 

router.delete('/:id', function (req, res, next) {
    service.delete(req.params.id).then(function (obj) {
        res.sendStatus(200).end();
    }, handleError());

});

router.get('/form', function (req, res, next) {
    var data = {};
    var brandPromise = brandService.list()
        .then(docs => data.brands = docs);
    var addressPromise = addressService.list()
        .then(docs => data.addresses = docs);

    var promises = [brandPromise, addressPromise];
    if (req.query.id) {
        var findPromise = service.findById(req.query.id).then(function (obj) {
            data.obj = obj;
            data.categories = lists.prepare(lists.categories, obj.category);
                data.reasons = lists.prepare(lists.reasons, obj.reason);
                data.units = lists.prepare(lists.units, obj.unit);
                data.types = lists.prepare(lists.types, obj.type);
                data.currencies = lists.prepare(lists.currencies, obj.currency);

        }, handleError());
        promises.push(findPromise);
    } else {

        data.categories = lists.categories;
            data.reasons = lists.reasons;
            data.units = lists.units;
            data.types = lists.types;
            data.currencies = lists.currencies;

    }

    Promise.all(promises).then(function () {
        console.log(JSON.stringify(data));
        res.render("items/form", data);
    });

});

router.post('/form', function (req, res, next) {

    if (req.query.id)
        service.update(req.query.id, req.body).then(function (obj) {
            res.redirect("list");
        }, handleError());
    else
        service.insert(req.body).then(function (obj) {
            res.redirect("list");
        }, handleError());


});

module.exports = router;