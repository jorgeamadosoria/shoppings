mongoose = require('./connect');
var mongoose_csv = require('mongoose-csv');

/**
 * Address
 * @requires connect
 * @requires mongoose-csv
 * @typedef {Object} Address
 * @property {string} name - the name of the store, or point of sale 
 * @property {string} address - street address
 * @property {string} country - country of the item
 * @property {string} region - province, county, city or region of the item
 * @property {string} mapSrc - url of the Google Maps medium embedded frame
 */
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