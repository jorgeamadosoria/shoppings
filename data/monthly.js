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
        //     console.log(moment(this.lastPaidDate).month());
        console.log(moment(this.lastPaidDate).format("YYYY-MM-DD").month());
        /*    console.log(moment().month() == moment.month(this.lastPaidDate) && moment().year() == moment.year(this.lastPaidDate));
            if (this.lastPaidDate)
                return moment().month() == moment.month(this.lastPaidDate) && moment().year() == moment.year(this.lastPaidDate);
         */
        return false;
    });

module.exports = mongoose.model("Monthly", MonthlySchema);