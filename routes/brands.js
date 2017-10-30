var express = require('express');
var service = require('../services/brand');
var listService = require('../services/list');
var utils = require('../data/utils');

var router = express.Router();

router.get('/list', utils.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    service.list().then(function(obj) {
        res.locals.list = obj;
        res.render("brands/list");
    }, utils.handleError);
});

router.get('/detail/:id', utils.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.render("brands/detail", obj);
    }, utils.handleError);
});

router.delete('/:id', utils.loggedRole(["user", "admin"]), utils.deleteMw);

router.get('/form', utils.loggedRole(["user", "admin"]), function(req, res, next) {
    if (req.query.id)
        service.findById(req.query.id).then(function(obj) {
            res.render("brands/form", obj);
        }, utils.handleError);
    else
        res.render("brands/form");
});

router.post('/form', utils.loggedRole(["user", "admin"]), function(req, res, next) {
    var callback = obj => res.redirect("list");
    if (req.query.id)
        service.update(req.query.id, req.body).then(callback, utils.handleError);
    else
        service.insert(req.body).then(callback, utils.handleError);
});

module.exports = router;