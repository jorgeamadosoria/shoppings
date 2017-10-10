var model = require('../data/item');
var moment = require('moment');

module.exports = {
    getMatch: function(currency, month) {
        var fromD = moment(month + "-01T00:00:00.000Z").utc();
        return {
            $match: {
                $and: [
                    { date: { "$gte": fromD.utc().toDate() } },
                    { date: { "$lt": fromD.add(1, "month").utc().toDate() } },
                    { currency: currency }
                ]
            }
        };
    },

    categoriesChart: function(currency, month) {
        return model.aggregate([this.getMatch(currency, month), { $group: { _id: { value: "$category", currency: "$currency" }, total: { $sum: "$item_cost" } } }, { $sort: { total: -1 } }]).exec();
    },
    reasonsChart: function(currency, month) {
        return model.aggregate([this.getMatch(currency, month), { $group: { _id: { value: "$reason", currency: "$currency" }, total: { $sum: "$item_cost" } } }, { $sort: { total: -1 } }]).exec();
    },

    itemList: function(currency, month) {
        return model.find(
            this.getMatch(currency, month)["$match"]
        ).populate("address").populate("brand").exec();
    },

    monthlyTotal: function(currency, month) {

        return model.aggregate([this.getMatch(currency, month),
            {
                $group: {
                    _id: { currency: "$currency" },
                    total: { $sum: "$item_cost" }
                }
            }
        ]).exec();
    },
};