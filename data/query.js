mongoose = require('./connect');
var utils = require('./utils');
var _ = require("underscore");
var paginate = require('mongoose-paginate');

/**
 * Query
 * @requires connect
 * @requires underscore
 * @requires mongoose-paginate
 * @requires utils
 * @typedef {Object} Query
 * @property {string} name - name of the saved query 
 * @property {string} query - json array of criteria object describing this query
 * @property {string} description - brief description of the query. Optional
 */
var QuerySchema = new mongoose.Schema({
    "name": {
        type: String,
        default: "",
    },
    "description": {
        type: String,
        default: "",
    },
    "query": {
        type: String,
        default: "{}",
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

module.exports = mongoose.model("Query", QuerySchema);