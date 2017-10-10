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
        console.log(this.name);
        console.log(this.address);
        console.log(this.region);
        console.log(this.country);
        return [this.name, this.address, this.region, this.country].join(",");
    });
var addressModel = mongoose.model("Address", AddressSchema);

module.exports = addressModel;