var model = require('../data/item');

module.exports = {
    categoriesChart: function(currency) {
        return model.aggregate([{$match: {currency:currency}},{ $group: { _id: { category: "$category", currency: "$currency" }, total: { $sum: "$item_cost" } } }]).exec();
    }
};