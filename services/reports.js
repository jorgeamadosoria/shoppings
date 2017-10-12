var model = require('../data/item');
var moment = require('moment');

module.exports = {
    getMatch: function(currency, month) {
        var fromD = moment(month + "-01T00:00:00.000Z");
        return {
            $match: {
                $and: [
                    { $or: [{ item_cost: { $type: 18 } }, { item_cost: { $type: 19 } }, { item_cost: { $type: 16 } }, { item_cost: { $type: 1 } }] },

                    { units_bought: { $type: 16 } },
                    {
                        date: {
                            "$gte": fromD.utc().toDate()
                        }
                    },
                    {
                        date: {
                            "$lt": fromD.add(1, "month").utc().toDate()
                        }
                    },
                    {
                        currency: currency
                    }
                ]
            }
        };
    },
    dailyTotal: function(currency, month) {
        return model.aggregate([this.getMatch(currency, month),
            {
                $project: {
                    date: 1,
                    total: {
                        $multiply: ["$item_cost", "$units_bought"]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        value: "$date"
                    },
                    total: {
                        $sum: "$total"
                    }
                }
            },
            {
                $sort: {
                    date: 1
                }
            }
        ]).exec();
    },
    categoriesChart: function(currency, month) {
        return model.aggregate([this.getMatch(currency, month), {
                $project: {
                    date: 1,
                    category: 1,
                    total: {
                        $multiply: ["$item_cost", "$units_bought"]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        value: "$category"
                    },
                    total: {
                        $sum: "$total"
                    }
                }
            }, {
                $sort: {
                    total: -1
                }
            }
        ]).exec();
    },
    reasonsChart: function(currency, month) {
        return model.aggregate([this.getMatch(currency, month), {
                $project: {
                    date: 1,
                    reason: 1,
                    total: {
                        $multiply: ["$item_cost", "$units_bought"]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        value: "$reason"
                    },
                    total: {
                        $sum: "$total"
                    }
                }
            }, {
                $sort: {
                    total: -1
                }
            }
        ]).exec();
    },

    topAddresses: function(currency, month) {
        return model.aggregate([this.getMatch(currency, month), {
                $project: {
                    address: 1,
                    total: {
                        $multiply: ["$item_cost", "$units_bought"]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        value: "$address"
                    },
                    total: {
                        $sum: "$total"
                    }
                }
            }, {
                $sort: {
                    total: -1
                }
            },
            { $limit: 10 },
            {
                $lookup: {
                    from: "addresses",
                    localField: "_id.value",
                    foreignField: "_id",
                    as: "_id.value"
                }
            }
        ]).exec();
    },

    itemList: function(currency, month) {
        return model.find(
            this.getMatch(currency, month)["$match"]
        ).populate("address").populate("brand").sort("date").exec();
    },

    monthlyTotal: function(currency, month) {

        return model.aggregate([this.getMatch(currency, month),
            {
                $group: {
                    _id: {
                        currency: "$currency"
                    },
                    total: {
                        $sum: "$item_cost"
                    }
                }
            }
        ]).exec();
    },
};