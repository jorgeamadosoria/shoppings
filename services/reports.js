var model = require('../data/item');
var moment = require('moment');

module.exports = {
    categoriesChart: function(currency) {
        return model.aggregate([{ $match: { currency: currency } }, { $group: { _id: { value: "$category", currency: "$currency" }, total: { $sum: "$item_cost" } } }, { $sort: { total: -1 } }]).exec();
    },
    reasonsChart: function(currency) {
        return model.aggregate([{ $match: { currency: currency } }, { $group: { _id: { value: "$reason", currency: "$currency" }, total: { $sum: "$item_cost" } } }]).exec();
    },

    monthlyTotal: function(currency,month) {
        var fromD =  moment(month + "-01T00:00:00.000Z").utc();
        console.log(month);
        console.log(fromD.utc().toDate());
        return model.aggregate([
            { $match: {$and: [
                {date:{"$gte" : fromD.utc().toDate()}},
                                {date:{"$lt" : fromD.add(1,"month").utc().toDate()}}
                             ]} }, 
            { $group: { _id: { currency: "$currency" }, 
            total: { $sum: "$item_cost" } } }]
        ).exec();
    },
};