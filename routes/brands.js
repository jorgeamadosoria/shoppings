var express = require('express');
var service = require('../services/brand');
var router = express.Router();

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/list', function(req, res, next) {
    service.list().then(function(obj) {
        res.render("brands/list", {
            "list": obj
        });
    }, handleError());
});

router.get('/detail/:id', function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.render("brands/detail", obj);
    }, handleError());
});

router.delete('/:id', function(req, res, next) {
    service.delete(req.params.id).then(function(obj) {
        res.sendStatus(200).end();
    }, handleError());

});

router.get('/form', function(req, res, next) {
    if (req.query.id)
        service.findById(req.query.id).then(function(obj) {
            res.render("brands/form", obj);
        }, handleError());
    else
        res.render("brands/form");
});

router.post('/form', function(req, res, next) {

    if (req.query.id)
        service.update(req.query.id, req.body).then(function(obj) {
            res.redirect("list");
        }, handleError());
    else
        service.insert(req.body).then(function(obj) {
            res.redirect("list");
        }, handleError());
});

module.exports = router;