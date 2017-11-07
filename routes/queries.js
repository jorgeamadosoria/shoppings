var service = require('../services/query');
var utils = require('../data/utils');

/**
 * @fileOverview CRUD Router for the query object
 *
 * @requires services/query
 * @requires data/utils
 * 
 * @exports module
 */
module.exports = utils.createCrudRouter(service, "queries", ["reviewer", "user", "admin"], ["user", "admin"], function(req, res, next) {
    if (req.query.id)
        service.findById(req.query.id).then(obj => res.render("queries/form", obj), utils.handleError);
    else
        res.render("queries/form");
});