var express = require('express');
var _ = require("underscore");
var JSZip = require("jszip");
var utils = require('../data/utils');
var itemService = require('../services/item');
var userService = require('../services/user');
var listService = require('../services/list');
var brandService = require('../services/brand');
var queryService = require('../services/query');
var addressService = require('../services/address');

var router = express.Router();
/**
 * This function creates a lambda that zips a file containing a JSON representation of all the entites of the application. Useful as backup
 *
 * @param {string} file - the name of the JSON file, corresponding to the entity to be zipped
 * @return {Function} a lambda corresponding to a zipping action to respond to a fulfilled promise
 *
 * @example
 *     zipper("brands.json")
 */
function zipper(file) {
    return docs => zip.file(file, JSON.stringify(docs));
};

/**
 * Middleware to expose the Zip Export feature. 
 * This is an admin level operation that allows said admin to export the whole database in a zip file, 
 * containing JSON collections of all existing entities in the database. Useful as backup or to move the database 
 * somewhere else
 *
 */
router.get('/export', utils.loggedRole(["admin"]), function(req, res, next) {
    zip = new JSZip();
    Promise.all([brandService.list().then(zipper("brands.json")),
        addressService.list().then(zipper("address.json")),
        itemService.list({}).then(zipper("items.json")),
        userService.list().then(zipper("users.json")),
        queryService.list().then(zipper("queries.json")),
        listService.list().then(zipper("lists.json"))
    ]).then(function(docs) {
        zip.generateAsync({ type: "nodebuffer", compression: "STORE", })
            .then(function(blob) {
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename=backup.zip'
                });
                res.end(blob);
            });

    }, utils.handleError);
});

/**
 * @fileOverview CRUD Router for the users
 *
 * @requires express
 * @requires underscore
 * @requires jszip
 * @requires services/item
 * @requires services/user
 * @requires services/list
 * @requires services/brand
 * @requires services/query
 * @requires services/address
 * @requires data/utils
 * 
 * @exports module
 */
module.exports = router;