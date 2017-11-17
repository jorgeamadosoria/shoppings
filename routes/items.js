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

/**
 * This function exposes the csv endpoint to admin users. It allows us to get a list of items in csv format.
 * Useful for data comparisons and exports. It exports dependent entities in readable format
 *
 */
router.get('/csv', utils.loggedRole(["admin"]), function(req, res, next) {
    res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=items.csv'
    });
    service.csv(res);
});

/**
 * This function exposes the list of items to all logged users. Important for both the home page and the search page
 *
 */
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

/**
 * This function exposes the search feature for items, allowing the logged users to search using any 
 * combination of criteria or saved queries. It renders without layout to allow embedding
 *
 */
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

/**
 * This function exposes the detailed view of one item to all logged users as a JSON response.
 * Useful to show in a dialog window
 *
 */
router.get('/detail/:id', utils.loggedRole(["reviewer", "user", "admin"]), function(req, res, next) {
    service.findById(req.params.id).then(function(obj) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
    }, utils.handleError);
});

/**
 * This function exposes the delete feature to standard users and admins
 *
 */
router.delete('/:id', utils.loggedRole(["user", "admin"]), utils.deleteMw(service));

/**
 * This function exposes the upsert UI feature to standard users and admins
 *
 */
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

/**
 * This function exposes the backend upsert feature to standard users and admins
 *
 */
router.post('/update', utils.loggedRole(["user", "admin"]), function(req, res, next) {
    if (req.body.id) {
        service.update(req.body.id, req.body).then(function(obj) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(obj));
        }, utils.handleError);
    } else
        service.insert(req.body).then(obj => res.sendStatus(200).end(), utils.handleError);

});

/**
 * @fileOverview CRUD Router for items.It also contains additional features like search by criteria and csv exporting
 *
 * @requires express
 * @requires underscore
 * @requires services/brand
 * @requires services/address
 * @requires services/query
 * @requires services/list
 * @requires services/item
 * @requires data/item
 * @requires data/utils
 * 
 * @exports module
 */
module.exports = router;