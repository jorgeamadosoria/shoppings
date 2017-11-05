var service = require('../services/brand');
var utils = require('../data/utils');

module.exports = utils.createCrudRouter(service, "brands", ["reviewer", "user", "admin"], ["user", "admin"], function(req, res, next) {
    if (req.query.id)
        service.findById(req.query.id).then(obj => res.render("brands/form", obj), utils.handleError);
    else
        res.render("brands/form");
});