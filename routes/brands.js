var express = require('express');
var listService = require('../services/lists');
var router = express.Router();

router.get('/list', function (req, res, next) {
    listService.listBrand().then(function (brands) {
        res.render("brands/list", {
            "brands": brands
        });
    });
});

router.get('/detail/:id', function (req, res, next) {
    listService.findBrandById(req.params.id).then(function (doc) {
        res.render("details/", doc);
    });
});

router.delete('/:id', function (req, res, next) {
    listService.deleteBrand(req.params.id).then(function(doc){
        res.sendStatus(200).end();
    });
    
});

router.get('/form', function (req, res, next) {
    if (req.query.id)
        listService.findBrandById(req.query.id).then(function (doc) {
            res.render("brands/form", doc);
        });
    else
        res.render("brands/form");
});

router.post('/form', function (req, res, next) {

    if (req.query.id)
        listService.updateBrand(req.query.id, req.body).then(function (doc) {
            res.redirect("list");
        });
    else
        listService.insertBrand(req.body).then(function (doc) {
            res.redirect("list");
        });
});

module.exports = router;