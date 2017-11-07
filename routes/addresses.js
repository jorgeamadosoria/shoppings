var service = require('../services/address');
var listService = require('../services/list');
var utils = require('../data/utils');
/**
 * @fileOverview CRUD Router for addresses
 *
 * @requires services/address
 * @requires services/list
 * @requires data/utils
 * 
 * @exports module
 */
module.exports = utils.createCrudRouter(service, "addresses", ["reviewer", "user", "admin"], ["user", "admin"], function(req, res, next) {

    listService.list().then(function(docs) {
        res.locals.lists = listService.listsObject(docs);
        if (req.query.id) {
            service.findById(req.query.id).then(function(obj) {
                res.locals.obj = obj;
                res.locals.lists.countries.splice(res.locals.lists.countries.indexOf(obj.country), 1);
                res.render("addresses/form");
            }, utils.handleError);
        } else {
            res.render("addresses/form");
        }
    });
});