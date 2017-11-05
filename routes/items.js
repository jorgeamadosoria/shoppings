var express = require('express');
var _ = require("underscore");
var Item = require('../data/item');
var utils = require('../data/utils');
var service = require('../services/item');
var listService = require('../services/list');
var brandService = require('../services/brand');
var addressService = require('../services/address');
var queryService = require('../services/query');

var router = express.Router();

router.get('/csv', utils.loggedRole(["admin"]), function(req, res, next) {
    res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=items.csv'
    });
    service.csv(res);
});

router.get('/list', utils.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {

    Promise.all([brandService.list().then(docs => res.locals.brands = docs),
        addressService.list().then(docs => res.locals.addresses = docs),
        service.monthlyList().then(docs => res.locals.monthly = docs),
        listService.list().then(docs => res.locals.lists = listService.listsObject(docs)),
        queryService.list().then(docs => res.locals.queries = docs)
    ]).then(function(obj) {
        res.locals.searchObjs = new Item().toSearchObject();
        res.render("items/list");
    }, utils.handleError);
});

router.post('/search', utils.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {

    Promise.all([brandService.list().then(docs => res.locals.brands = docs),
        addressService.list().then(docs => res.locals.addresses = docs),
        service.monthlyList().then(docs => res.locals.monthly = docs),
        listService.list().then(docs => res.locals.lists = listService.listsObject(docs)),
        service.paginate(req.body).then(docs => res.locals.list = docs, utils.handleError)
    ]).then(function(obj) {
        res.render("items/search", {
            layout: false
        });
    }, utils.handleError);

});


router.get('/detail/:id', utils.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
    }, utils.handleError);
});

router.delete('/:id', utils.loggedRole(["user", "admin"]), utils.deleteMw);

router.get('/form', utils.loggedRole(["user", "admin"]), function(req, res, next) {

    var promises = [brandService.list().then(docs => res.locals.brands = docs),
        addressService.list().then(docs => res.locals.addresses = docs),
        listService.list().then(docs => res.locals.lists = listService.listsObject(docs)),
        service.monthlyList().then(docs => res.locals.monthly = docs)
    ];
    if (req.query.id) {
        promises.push(service.findById(req.query.id).then(function(obj) {
            res.locals.obj = obj;
            res.locals.lists.categories.splice(res.locals.lists.categories.indexOf(obj.category), 1);
            res.locals.lists.reasons.splice(res.locals.lists.reasons.indexOf(obj.reason), 1);
            res.locals.lists.monthly.splice(utils.monthly.indexOf(obj.monthly), 1);
            res.locals.lists.units.splice(res.locals.lists.units.indexOf(obj.unit), 1);
            res.locals.lists.types.splice(res.locals.lists.types.indexOf(obj.type), 1);
            res.locals.lists.currencies.splice(res.locals.lists.currencies.indexOf(obj.currency), 1);
        }, utils.handleError));
    }

    Promise.all(promises).then(function() {
        if (res.locals.obj) {
            res.locals.brands = utils.listSansObj(res.locals.brands, res.locals.obj.brand);
            res.locals.addresses = utils.listSansObj(res.locals.addresses, res.locals.obj.address);
        }

        res.render("items/form");
    });

});

router.post('/update', utils.loggedRole(["user", "admin"]), function(req, res, next) {
    if (req.body.id) {
        service.update(req.body.id, req.body).then(function(obj) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(obj));
        }, utils.handleError);
    } else
        service.insert(req.body).then(obj => res.sendStatus(200).end(), utils.handleError);

});

module.exports = router;