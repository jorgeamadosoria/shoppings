var express = require('express');
var service = require('../services/list');
var utils = require('../data/utils');


var router = express.Router();

router.get('/list', utils.loggedRole(["admin"]), function(req, res, next) {
    service.list().then(function(obj) {
        res.render("lists/list", {
            "list": obj
        });
    }, utils.handleError);
});

router.get('/detail/:id', utils.loggedRole(["admin"]), function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.render("lists/detail", obj);
    }, utils.handleError);
});

router.delete('/:id', utils.loggedRole(["admin"]), utils.deleteMw);

router.get('/form', utils.loggedRole(["admin"]), function(req, res, next) {
    if (req.query.id)
        service.findById(req.query.id).then(function(obj) {
            res.render("lists/form", obj);
        }, utils.handleError);
    else
        res.render("lists/form");
});

router.post('/form', utils.loggedRole(["admin"]), function(req, res, next) {
    if (req.query.id)
        service.update(req.query.id, req.body).then(function(obj) {
            res.redirect("list");
        }, utils.handleError);
    else
        service.insert(req.body).then(function(obj) {
            res.redirect("list");
        }, utils.handleError);
});

module.exports = router;