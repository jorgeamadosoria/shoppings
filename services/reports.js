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
        var fromD =  moment(month + "-01");
        var from = fromD.format("YYYY-MM-DD");
        var to = fromD.add(1,"month").format("YYYY-MM-DD");
        return model.aggregate([{ $match: {$and: [{date:{"$gte" : from}},{date:{"$lt" : to}}]} }, { $group: { _id: { currency: "$currency" }, total: { $sum: "$item_cost" } } }]).exec();
    },
};