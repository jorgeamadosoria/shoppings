var service = require('../services/query');
var utils = require('../data/utils');

module.exports = utils.createCrudRouter(service, "queries", ["reviewer", "user", "admin"], ["user", "admin"], function(req, res, next) {
    if (req.query.id)
        service.findById(req.query.id).then(obj => res.render("queries/form", obj), utils.handleError);
    else
        res.render("queries/form");
});