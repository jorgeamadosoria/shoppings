mongoose = require('./connect');

var AddressSchema = new mongoose.Schema({
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


AddressSchema.virtual('fullAddress')
    .get(function() {
        return this.address + ',' + this.region + ',' + this.country;
    });
var addressModel = mongoose.model("Address", AddressSchema);

module.exports = addressModel;