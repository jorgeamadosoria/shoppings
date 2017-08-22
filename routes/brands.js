var express = require('express');
var listService = require('../services/lists');
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res, next) {
  res.render("brands/list",{ "num":100, "units":listService.getUnits()});
});

router.get('/detail/:id', function(req, res, next) {
  res.render("brands/detail",{ "num":100, "units":listService.findBrandById(req.params.id)});
});

router.delete('/:id', function(req, res, next) {
  
});

router.get('/form', function(req, res, next) {
  res.render("brands/form",{ });
});

router.post('/form', function(req, res, next) {
 // res.render("brands/form",{ "num":100, "units":listService.insertBrand(req.params)});
});



module.exports = router;
