var express = require('express');
var listService = require('../services/lists');
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res, next) {
    listService.listBrand(function(brands) {
        res.render("brands/list", { "brands": brands });
    });
});

router.get('/detail/:id', function(req, res, next) {
    res.render("brands/detail", { "num": 100, "units": listService.findBrandById(req.params.id) });
});

router.delete('/:id', function(req, res, next) {

});

router.get('/form', function(req, res, next) {
    if (req.query.id)
        res.render("brands/form", listService.findBrandById(req.query.id));
    else
        res.render("brands/form");
});

router.post('/form', function(req, res, next) {

    if (req.body.id)
        listService.updateBrand(req.body.id, req.body);
    else
        listService.insertBrand(req.body);

    res.redirect("/brands/list");
});



module.exports = router;