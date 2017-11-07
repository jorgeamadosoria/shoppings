var service = require('../services/list');
var utils = require('../data/utils');

/**
 * @fileOverview CRUD Router for the lists
 *
 * @requires services/list
 * @requires data/utils
 * 
 * @exports module
 */
module.exports = utils.createCrudRouter(service, "lists", ["admin"], ["admin"], function(req, res, next) {
    if (req.query.id)
        service.findById(req.query.id).then(function(obj) {
            res.render("lists/form", obj);
        }, utils.handleError);
    else
        res.render("lists/form");
});