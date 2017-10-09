var model = require('../data/item');

module.exports = {
    categoriesChart: function(currency) {
        return model.aggregate([{ $match: { currency: currency } }, { $group: { _id: { value: "$category", currency: "$currency" }, total: { $sum: "$item_cost" } } }, { $sort: { total: -1 } }]).exec();
    },
    reasonsChart: function(currency) {
        return model.aggregate([{ $match: { currency: currency } }, { $group: { _id: { value: "$reason", currency: "$currency" }, total: { $sum: "$item_cost" } } }, { $sort: { total: -1 } }]).exec();
    }
};