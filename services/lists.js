var units = require("../data/units.mock");
var brandModel = require('../data/brand');

var handleError = function(err){
  console.log("ERROR:" + err);
  return null;
}

var insertCallback = function (err, object) {
  if (err) return handleError(err);
  console.log("saved:" + object);
};

var removeCallback = function (err, object) {
  if (err) return handleError(err);
  console.log("removed:" + object);
};

module.exports = {
  getUnits:function (){
    
        return units;
  },

  insertBrand:function (brand){
        BrandModel.create(brand, insertCallback);    
  },

  deleteBrand:function (brandId){
    BrandModel.findByIdAndRemove(brandId,removeCallback);    
  },

  listBrand:function (){
    var result = null;
    BrandModel.find().lean().exec(function (err, docs) {
      if (err) 
        return handleError(err);
      console.log("found:" + docs.length);
      result = docs;
    });
     return result;
  },

  findBrandById:function (brandId){
    var result = null;
     BrandModel.findById(brandId,function (err, doc) {
      if (err) 
        return handleError(err);
      console.log("found:" + doc);
      result = doc;
    });
    return result;
  }
};
