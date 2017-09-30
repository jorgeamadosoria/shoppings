var model = require('../data/items');

module.exports = {
    categoriesChart: function() {
        return model.aggregate([{ $group: { _id: { category: "$category", currency: "$currency" }, total: { $sum: "$item_cost" } } }]).lean().exec();
    }
};