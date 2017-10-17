mongoose = require('./connect');
var mongoose_csv = require('mongoose-csv');

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
    "website": {
        type: String,
        default: ""
    }
});

brandSchema.virtual('toCSVString')
    .get(function() {
        return this.name;
    });

brandSchema.plugin(mongoose_csv);

module.exports = mongoose.model("Brand", brandSchema);