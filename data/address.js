mongoose = require('./connect');

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


AddressSchema.virtual('fullAddress')
    .get(function() {
        return this.name + ',' + this.address + ',' + this.region + ',' + this.country;
    });
var addressModel = mongoose.model("Address", AddressSchema);

module.exports = addressModel;