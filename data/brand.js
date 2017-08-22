mongoose = require('./connect');

var brandModel = mongoose.model("Brand",new mongoose.Schema({
    "name":String,
    "description":String,
    "website":String
}));


module.exports = brandModel;

