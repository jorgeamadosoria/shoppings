mongoose = require('./connect');
lists = require('./lists');
var _ = require("underscore");
var paginate = require('mongoose-paginate');


var QuerySchema = new mongoose.Schema({
    "data": {
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