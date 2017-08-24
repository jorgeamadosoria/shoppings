var units = require("../data/units.mock");
var brandModel = require('../data/brand');

var handleError = function (err) {
    console.log("ERROR:" + err);
    return null;
};

var insertCallback = function (err, object) {
    if (err) return handleError(err);
    console.log("saved:" + object);
};

var updateCallback = function (err, object) {
    if (err) return handleError(err);
    console.log("updated:" + object);
};

var removeCallback = function (err, object) {
    if (err) return handleError(err);
    console.log("removed:" + object);
};

var findCallback = function (err, docs) {
    if (err)
        return handleError(err);
    console.log("result:" + JSON.stringify(docs));
    return true;
};

module.exports = {

    getUnits: function () {

        return units;
    },

    insertBrand: function (brand) {
        brandModel.create(brand, insertCallback);
    },

    updateBrand: function (brandId, brand) {
        var id = mongoose.Types.ObjectId(brandId);
        brand._id = id;
        return brandModel.findByIdAndUpdate(id, brand).exec();
    },

    deleteBrand: function (brandId) {
        var id = mongoose.Types.ObjectId(brandId);
        return brandModel.findByIdAndRemove(id).exec();
    },

    listBrand: function () {

        return brandModel.find().lean().exec();

    },

    findBrandById: function (brandId) {
        var id = mongoose.Types.ObjectId(brandId);
        return brandModel.findById(id).lean().exec(function (err, doc) {
            if (err)
                return handleError(err);
            console.log("found:" + doc);
        });
    }
};