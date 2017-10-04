mongoose = require('./connect');
var moment = require('moment');

var MonthlySchema = new mongoose.Schema({
    "name": {
        type: String,
        default: ""
    },
    "lastPaidDate": {
        type: Date,
        default: Date.now
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});


MonthlySchema.virtual('paid')
    .get(function() {
        if (this.lastPaidDate)
            return moment().utc().month() == moment(this.lastPaidDate).utc().month() && moment().utc().year() == moment(this.lastPaidDate).utc().year();
        return false;
    });

module.exports = mongoose.model("Monthly", MonthlySchema);