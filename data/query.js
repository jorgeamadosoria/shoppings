mongoose = require('./connect');
var utils = require('./utils');
var _ = require("underscore");
var paginate = require('mongoose-paginate');


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