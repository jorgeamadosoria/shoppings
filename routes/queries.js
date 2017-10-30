var express = require('express');
var service = require('../services/query');
var utils = require('../data/utils');

var router = express.Router();

router.get('/list', utils.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    service.list().then(function(obj) {
        res.locals.list = obj;
        res.render("queries/list");
    }, utils.handleError);
});

router.get('/detail/:id', utils.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.render("queries/detail", obj);
    }, utils.handleError);
});

router.delete('/:id', utils.loggedRole(["user", "admin"]), utils.deleteMw);

router.get('/form', utils.loggedRole(["user", "admin"]), function(req, res, next) {
    if (req.query.id)
        service.findById(req.query.id).then(function(obj) {
            res.render("queries/form", obj);
        }, utils.handleError);
    else
        res.render("queries/form");
});

router.post('/form', utils.loggedRole(["user", "admin"]), function(req, res, next) {
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