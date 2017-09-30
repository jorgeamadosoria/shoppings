mongoose = require('./connect');

var MonthlySchema = new mongoose.Schema({
    "name": {
        type: String,
        default: ""
    },
    "template": {
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

/*
AddressSchema.virtual('fullAddress')
    .get(function() {
        return this.name + ',' + this.address + ',' + this.region + ',' + this.country;
    });
*/
var monthlyModel = mongoose.model("Monthly", MonthlySchema);

module.exports = monthlyModel;