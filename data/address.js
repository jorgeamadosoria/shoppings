mongoose = require('./connect');
var mongoose_csv = require('mongoose-csv');

var AddressSchema = new mongoose.Schema({
    "name": {
        type: String,
        default: ""
    },
    "address": {
        type: String,
        default: ""
    },
    "country": {
        type: String,
        default: ""
    },
    "region": {
        type: String,
        default: ""
    },
    "mapSrc": {
        type: String,
        default: ""
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

function fullAddress() {
    return [this.name, this.address, this.region, this.country].join(",");
}

AddressSchema.virtual('toCSVString')
    .get(fullAddress);

AddressSchema.plugin(mongoose_csv);
AddressSchema.virtual('fullAddress')
    .get(fullAddress);

module.exports = mongoose.model("Address", AddressSchema);