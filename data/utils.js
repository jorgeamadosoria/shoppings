var express = require('express');
var _ = require("underscore");
var moment = require("moment");

module.exports = {
    /**
     * This function creates a CRUD Router, that is, a Router to manage entities other than the main one.
     *
     * @param {string} service - The corresponding service to the entity we want to CRUD
     * @param {string} entity - The corresponding service to the entity we want to CRUD
     * @param {string[]} readRoles - Array of roles for read endpoints (list, detail)
     * @param {string[]} writeRoles - Array of roles for write endpoints (insert, update, delete)
     * @param {Object} formMw - Middleware for the "form" url. This is different for each router because each form requires different nomenclator entities
     * @return {Object} a fully configured CRUD router for the entity specified
     *
     * @example
     *     createCrudRouter(service, "brands", ["reviewer", "user", "admin"], ["user", "admin"], function(req, res, next) { ... });
     */
    createCrudRouter: function(service, entity, readRoles, writeRoles, formMw) {
        router = express.Router();
        router.get('/list', this.loggedRole(readRoles), this.listMw(service, entity));
        router.get('/detail/:id', this.loggedRole(readRoles), this.detailsMw(service, entity));
        router.delete('/:id', this.loggedRole(writeRoles), this.deleteMw(service));
        router.post('/form', this.loggedRole(writeRoles), this.upsertMw(service));
        router.get('/form', this.loggedRole(writeRoles), formMw);
        return router;
    },

    deleteMw: function(service) {
        return function(req, res, next) {
            service.delete(req.params.id).then(function(obj) {
                res.sendStatus(200).end();
            }, this.handleError);
        }
    },

    listMw: function(service, entity) {
        return function(req, res, next) {
            service.list().then(function(objs) {
                res.locals.list = objs;
                res.render(entity + "/list");
            }, this.handleError);
        };

    },

    upsertMw: function(service) {
        return function(req, res, next) {
            service.upsert(req.body, req.query.id).then(obj => res.redirect("list"), this.handleError);
        };
    },

    detailsMw: function(service, entity) {
        return function(req, res, next) {
            service.findById(req.params.id).then(obj => res.render(entity + "/detail", obj), this.handleError);
        };
    },

    loggedRole: function(roles) {
        //debugging switch
        var alwaysLoggedIn = true;

        return function(req, res, next) {
            if (!alwaysLoggedIn) {

                res.locals.user = req.user;
                if (req.user && req.isAuthenticated() && _.contains(roles, req.user.role))
                    return next();
                res.redirect('/login');
            } else {
                res.locals.user = { google: { name: "DEBUG", email: "email" }, role: "admin" };
                return next();
            }
        }
    },

    median: function(values) {

        values.sort(function(a, b) {
            return a - b;
        });

        var half = Math.floor(values.length / 2);

        if (values.length % 2)
            return values[half];
        else
            return (values[half - 1] + values[half]) / 2.0;
    },

    round: function(value, decimals) {
        return isNaN(value) ? value : (Number.isInteger(value) ? (value + ".00") : Number(Math.round(value + 'e' + decimals) + 'e-' + decimals));
    },

    handleError: function(err) {
        console.log("ERROR:" + err);
        return null;
    },

    listSansObj: function(list, obj) {
        if (obj) {
            var temp = [];
            list.forEach(function(element) {
                if (!_.isEqual(element._id, obj._id))
                    temp.push(element);
            });
            return temp;
        } else
            return list.slice();
    },
    stripNAorNull: function(list) {
        var temp = [];
        list.forEach(function(element) {
            if (!_.isEqual(element._id, "NA") && !_.isEqual(element._id, null))
                temp.push(element);
        });
        return temp;
    },
    currentMonth: function(date, today, notToday, options) {
        return (moment(date).utc().format("MM") == moment().utc().format("MM")) ? today : notToday;
    }
};