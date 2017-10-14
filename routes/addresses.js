var express = require('express');
var service = require('../services/address');
var listService = require('../services/list');
var lists = require('../data/lists');

var router = express.Router();



var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/list', lists.isLoggedIn, function(req, res, next) {
    service.list().then(function(objs) {
        res.render("addresses/list", {
            "list": objs
        });
    }, handleError);
});

router.get('/detail/:id', lists.isLoggedIn, function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.render("addresses/detail", obj);
    }, handleError);
});

router.delete('/:id', lists.isLoggedIn, function(req, res, next) {
    service.delete(req.params.id).then(function(obj) {
        res.sendStatus(200).end();
    }, handleError);

});

router.get('/form', lists.isLoggedIn, function(req, res, next) {

    var listPromise = listService.list().then(docs => data.lists = listService.listsObject(docs));
    Promise.all([listPromise]).then(function(obj) {
        if (req.query.id) {
            service.findById(req.query.id).then(function(obj) {
                res.render("addresses/form", {
                    "obj": obj,
                    "countries": lists.prepare(data.lists.countries, obj.country)
                });
            }, handleError);
        } else
            res.render("addresses/form", {
                "countries": data.lists.countries
            });
    });
});

router.post('/form', lists.isLoggedIn, function(req, res, next) {

    if (req.query.id)
        service.update(req.query.id, req.body).then(function(obj) {
            res.redirect("list");
        }, handleError);
    else
        service.insert(req.body).then(function(obj) {
            res.redirect("list");
        }, handleError);
});

module.exports = router;