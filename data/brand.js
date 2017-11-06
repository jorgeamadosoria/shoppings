mongoose = require('./connect');
var mongoose_csv = require('mongoose-csv');

/**
 * Brand
 * @requires connect
 * @requires mongoose-csv
 * @typedef {Object} Brand
 * @property {string} logo - url to imgBB for the logo of the bran
 * @property {string} name - name of the brand
 * @property {string} description - a brief description of the main products of the brand, history and other trivia
 */
var brandSchema = new mongoose.Schema({
    "logo": {
        type: String,
        default: ""
    },
    "name": {
        type: String,
        default: ""
    },
    "description": {
        type: String,
        default: ""
    },
});

brandSchema.virtual('toCSVString')
    .get(function() {
        return this.name;
    });

brandSchema.plugin(mongoose_csv);

module.exports = mongoose.model("Brand", brandSchema);