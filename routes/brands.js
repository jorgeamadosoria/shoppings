var express = require('express');
var listService = require('../services/lists');
var router = express.Router();

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/list', function(req, res, next) {
    listService.listBrand().then(function(brands) {
        res.render("brands/list", {
            "brands": brands
        });
    }, handleError());
});

router.get('/detail/:id', function(req, res, next) {
    listService.findBrandById(req.params.id).then(function(brand) {
        res.render("brands/detail", brand);
    }, handleError());
});

router.delete('/:id', function(req, res, next) {
    listService.deleteBrand(req.params.id).then(function(brand) {
        res.sendStatus(200).end();
    }, handleError());

});

router.get('/form', function(req, res, next) {
    if (req.query.id)
        listService.findBrandById(req.query.id).then(function(brand) {
            res.render("brands/form", brand);
        }, handleError());
    else
        res.render("brands/form");
});

router.post('/form', function(req, res, next) {

    if (req.query.id)
        listService.updateBrand(req.query.id, req.body).then(function(brand) {
            res.redirect("list");
        }, handleError());
    else
        listService.insertBrand(req.body).then(function(brand) {
            res.redirect("list");
        }, handleError());
});

module.exports = router;