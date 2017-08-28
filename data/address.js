mongoose = require('./connect');

var AddressSchema = new mongoose.Schema({
    "address":String,
    "country":String,
    "region":String,
    "mapSrc":String
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});


AddressSchema.virtual('fullAddress')
.get(function () {
    return this.address + ',' + this.region  + ',' + this.country;
});
var addressModel = mongoose.model("Address",AddressSchema);

module.exports = addressModel;

