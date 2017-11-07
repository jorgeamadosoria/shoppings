var service = require('../services/user');
var listService = require('../services/list');
var utils = require('../data/utils');

/**
 * @fileOverview CRUD Router for the users
 *
 * @requires services/user
 * @requires services/list
 * @requires data/utils
 * 
 * @exports module
 */
module.exports = utils.createCrudRouter(service, "users", ["admin"], ["admin"], function(req, res, next) {
    var listPromise = listService.list().then(docs =>
        res.locals.lists = listService.listsObject(docs));

    Promise.all([listPromise]).then(function() {
        if (req.query.id)
            service.findById(req.query.id).then(obj => res.render("users/form", obj), utils.handleError);
        else
            res.render("users/form");
    });
});