var express = require('express');
var service = require('../services/address');
var listService = require('../services/list');
var lists = require('../data/lists');

var router = express.Router();



var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/list', lists.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    service.list().then(function(objs) {
        res.locals.list = objs;
        res.render("addresses/list");
    }, handleError);
});

router.get('/detail/:id', lists.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.render("addresses/detail", obj);
    }, handleError);
});

router.delete('/:id', lists.loggedRole(["user", "admin"]), function(req, res, next) {
    service.delete(req.params.id).then(function(obj) {
        res.sendStatus(200).end();
    }, handleError);

});

router.get('/form', lists.loggedRole(["user", "admin"]), function(req, res, next) {

    var listPromise = listService.list().then(docs => res.locals.lists = listService.listsObject(docs));

    Promise.all([listPromise]).then(function(obj) {
        if (req.query.id) {
            service.findById(req.query.id).then(function(obj) {
                res.locals.obj = obj;
                res.locals.countries = lists.prepare(res.locals.lists.countries, obj.country);
                res.render("addresses/form");
            }, handleError);
        } else {
            res.locals.countries = res.locals.lists.countries;
            res.render("addresses/form");
        }
    });
});

router.post('/form', lists.loggedRole(["user", "admin"]), function(req, res, next) {

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