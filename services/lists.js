var units = require("../data/units.mock");
var brandModel = require('../data/brand');

var handleError = function(err) {
    console.log("ERROR:" + err);
    return null;
};

var insertCallback = function(err, object) {
    if (err) return handleError(err);
    console.log("saved:" + object);
};

var updateCallback = function(err, object) {
    if (err) return handleError(err);
    console.log("updated:" + object);
};

var removeCallback = function(err, object) {
    if (err) return handleError(err);
    console.log("removed:" + object);
};

var findCallback = function(err, docs) {
    if (err)
        return handleError(err);
    console.log("result:" + JSON.stringify(docs));
    return true;
};

module.exports = {

    getUnits: function() {

        return units;
    },

    insertBrand: function(brand) {
        brandModel.create(brand, insertCallback);
    },

    updateBrand: function(brandId, brand) {
        brandModel.findByIdAndUpdate(brandId, brand, updateCallback);
    },

    deleteBrand: function(brandId) {
        brandModel.findByIdAndRemove(brandId, removeCallback);
    },

    listBrand: function(renderCallback) {

        brandModel.find().lean().exec(function(err, docs) { if (findCallback(err, docs)) renderCallback(docs); });

    },

    findBrandById: function(brandId) {
        var result = null;
        brandModel.findById(brandId, function(err, doc) {
            if (err)
                return handleError(err);
            console.log("found:" + doc);
            result = doc;
        });
        return result;
    }
};