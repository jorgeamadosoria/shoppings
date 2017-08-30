mongoose = require('./connect');

var brandModel = mongoose.model("Brand", new mongoose.Schema({
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
    "website": {
        type: String,
        default: ""
    }
}));

module.exports = brandModel;