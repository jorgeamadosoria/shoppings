var express = require('express');
var _ = require("underscore");
var moment = require("moment");
/**
 * @fileOverview Utils model with functions for CRUD router, response data massaging and role authorization
 *
 * @requires underscore
 * @requires express
 * @requires moment
 * 
 * @exports module
 */
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

    /**
     * This function creates a CRUD middleware that calls a provided service for deletion
     *
     * @param {string} service - The corresponding service to the entity we want to CRUD
     * @return {Object} default CRUD middleware for deletion
     *
     */
    deleteMw: function(service) {
        return function(req, res, next) {
            service.delete(req.params.id).then(function(obj) {
                res.sendStatus(200).end();
            }, this.handleError);
        }
    },

    /**
     * This function creates a CRUD middleware that calls a provided service for list of entities
     *
     * @param {string} service - The corresponding service to the entity we want to CRUD
     * @param {string} entity - The corresponding service to the entity we want to CRUD
     * @return {Object} default CRUD middleware for list of entites
     *
     */
    listMw: function(service, entity) {
        return function(req, res, next) {
            service.list().then(function(objs) {
                res.locals.list = objs;
                res.render(entity + "/list");
            }, this.handleError);
        };

    },

    /**
     * This function creates a CRUD middleware that calls a provided service for the entity update
     *
     * @param {string} service - The corresponding service to the entity we want to CRUD
     * @return {Object} default CRUD middleware for update
     *
     */
    upsertMw: function(service) {
        return function(req, res, next) {
            service.upsert(req.body, req.query.id).then(obj => res.redirect("list"), this.handleError);
        };
    },

    /**
     * This function creates a CRUD middleware that calls a provided service for the full details of an entity, gotten from the db by id
     *
     * @param {string} service - The corresponding service to the entity we want to CRUD
     * @param {string} entity - The corresponding service to the entity we want to CRUD
     * @return {Object} default CRUD middleware for detailed view of entity by id
     *
     */
    detailsMw: function(service, entity) {
        return function(req, res, next) {
            service.findById(req.params.id).then(obj => res.render(entity + "/detail", obj), this.handleError);
        };
    },

    /**
     * This function creates a middleware that intercept calls and only allows those with the proper roles to continue down the chain
     *
     * @param {string[]} roles - array of roles that allow the user to reach the next middleware.
     * @return {function} standard middleware to intercept all requests to url
     *
     */
    loggedRole: function(roles) {
        //debugging switch
        var alwaysLoggedIn = false;

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

    /**
     * This function creates a default error handler for all promises used in the app. It merely writes the error message to the console
     *
     * @param {string} err - error message string to print
     * @return {any} always return null
     *
     */
    handleError: function(err) {
        console.log("ERROR:" + err);
        return null;
    },

    /**
     * This function takes a list of values and take away the one corresponding with the current item
     *
     * @param {Object[]} list - complete list of values
     * @param {Object} obj - particular object value to take away from the list
     * @return {function} list without the object selected
     *
     */
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

    /**
     * This function takes a list of values and take away a null value or NA value if any is present
     *
     * @param {Object[]} list - complete list of values
     * @return {Object[]} list without NA or null values
     *
     */
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