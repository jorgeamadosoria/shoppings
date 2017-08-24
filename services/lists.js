var units = require("../data/units.mock");
var brandModel = require('../data/brand');

module.exports = {

    getUnits: function() {

        return units;
    },

    insertBrand: function(brand) {
        brandModel.create(brand, insertCallback);
    },

    updateBrand: function(brandId, brand) {
        var id = mongoose.Types.ObjectId(brandId);
        brand._id = id;
        return brandModel.findByIdAndUpdate(id, brand).exec();
    },

    deleteBrand: function(brandId) {
        var id = mongoose.Types.ObjectId(brandId);
        return brandModel.findByIdAndRemove(id).exec();
    },

    listBrand: function() {

        return brandModel.find().lean().exec();

    },

    findBrandById: function(brandId) {
        var id = mongoose.Types.ObjectId(brandId);
        return brandModel.findById(id).lean().exec(function(err, doc) {
            if (err)
                return handleError(err);
            console.log("found:" + doc);
        });
    }
};