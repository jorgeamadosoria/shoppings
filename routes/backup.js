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

function zipper(file) {
    return docs => zip.file(file, JSON.stringify(docs));
};

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


module.exports = router;