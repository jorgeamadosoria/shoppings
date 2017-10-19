var express = require('express');
var _ = require("underscore");
var JSZip  = require("jszip");
var lists = require('../data/lists');
var itemService = require('../services/item');
var userService = require('../services/user');
var listService = require('../services/list');
var brandService = require('../services/brand');
var queryService = require('../services/query');
var addressService = require('../services/address');

var router = express.Router();

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

router.get('/export', lists.loggedRole(["admin"]), function(req, res, next) {
    var zip = new JSZip();
    var brandPromise    = brandService.list().then(         docs => zip.file("brand.json"  , JSON.stringify(docs)));
    var addressPromise  = addressService.list().then(       docs => zip.file("brands.json" , JSON.stringify(docs)));
    var itemPromise     = itemService.list({}).then(          docs => zip.file("items.json"  , JSON.stringify(docs)));
    var userPromise     = userService.list().then(          docs => zip.file("users.json"  , JSON.stringify(docs)));
    var queryPromise    = queryService.list().then(         docs => zip.file("queries.json", JSON.stringify(docs)));
    var listPromise     = listService.list().then(          docs => zip.file("lists.json"  , JSON.stringify(docs)));
    Promise.all([brandPromise,addressPromise,itemPromise,userPromise,queryPromise,listPromise]).then(function(docs){
        zip.generateAsync({type:"nodebuffer",compression: "STORE",})
        .then(function (blob) {
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename=backup.zip'
            });
            res.end(blob);
        });

    });
});


module.exports = router;