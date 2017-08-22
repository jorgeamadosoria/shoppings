var express = require('express');
var listService = require('../services/lists');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("brands",{ "num":100, "units":listService.getUnits()});
});

module.exports = router;
