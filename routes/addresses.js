var express = require('express');
var service = require('../services/address');
var listService = require('../services/list');
var utils = require('../data/utils');

var router = express.Router();


router.get('/list', utils.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    service.list().then(function(objs) {
        res.locals.list = objs;
        res.render("addresses/list");
    }, utils.handleError);
});

router.get('/detail/:id', utils.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.render("addresses/detail", obj);
    }, utils.handleError);
});

router.delete('/:id', utils.loggedRole(["user", "admin"]), utils.deleteMw);

router.get('/form', utils.loggedRole(["user", "admin"]), function(req, res, next) {

    var listPromise = listService.list().then(function(obj) {
        res.locals.lists = listService.listsObject(docs);
        if (req.query.id) {
            service.findById(req.query.id).then(function(obj) {
                res.locals.obj = obj;
                res.locals.lists.countries.splice(res.locals.lists.countries.indexOf(obj.country), 1);
                res.render("addresses/form");
            }, utils.handleError);
        } else {
            res.render("addresses/form");
        }
    });
});

router.post('/form', utils.loggedRole(["user", "admin"]), function(req, res, next) {

    var callback = function(obj) {
        res.redirect("list");
    };

    if (req.query.id)
        service.update(req.query.id, req.body).then(callback, utils.handleError);
    else
        service.insert(req.body).then(callback, utils.handleError);
});

module.exports = router;