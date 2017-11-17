var model = require('../data/item');
var moment = require('moment');

/**
 * @fileOverview Service for report mongoose queries. All methods are supposed
 * to return data for each section of the report.
 *
 * @requires data/item
 * @requires moment
 * 
 * @exports module
 */
module.exports = {

    /**
     * This function defines the $match filter for the mongoose pipeline of all report sections
     *
     * @param {string} currency - the currency to generate the report on. 
     * @param {string} month - month and year to generate the report. 
     * @return {Object} a $match object
     *
     */
    getMatch: function(currency, month) {
        var fromD = moment(month + "-01T00:00:00.000Z");
        return {
            $match: {
                $and: [
                    { $or: [{ item_cost: { $type: 18 } }, /*{ item_cost: { $type: 19 } },*/ { item_cost: { $type: 16 } }, { item_cost: { $type: 1 } }] },

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

    /**
     * This function defines the list days and the total expense 
     * for each one, ordered chronologically
     * 
     * @param {string} currency - the currency to generate the report on. 
     * @param {string} month - month and year to generate the report. 
     * @return {Object} a promise for this object
     *
     */
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

    /**
     * This function defines the list of categories and the total expense 
     * for each one, ordered descendently
     * 
     * @param {string} currency - the currency to generate the report on. 
     * @param {string} month - month and year to generate the report. 
     * @return {Object} a promise for this object
     *
     */
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

    /**
     * This function defines the list of reasons and the total expense 
     * for each one, ordered descendently
     * 
     * @param {string} currency - the currency to generate the report on. 
     * @param {string} month - month and year to generate the report. 
     * @return {Object} a promise for this object
     *
     */
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

    /**
     * This function defines the top 10 addresses where the most 
     * expenses where made on the selected month
     * 
     * @param {string} currency - the currency to generate the report on. 
     * @param {string} month - month and year to generate the report. 
     * @return {Object} a promise for this object
     *
     */
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

    /**
     * This function defines the top 10 addresses where the most 
     * expenses where made on the selected month
     * 
     * @param {string} currency - the currency to generate the report on. 
     * @param {string} month - month and year to generate the report. 
     * @return {Object} a promise for this object
     *
     */
    itemList: function(currency, month) {
        return model.find(
            this.getMatch(currency, month)["$match"]
        ).populate("address").populate("brand").sort("date").exec();
    },

    /**
     * This function defines the total monthly expenses
     * 
     * @param {string} currency - the currency to generate the report on. 
     * @param {string} month - month and year to generate the report. 
     * @return {Object} a promise for this object
     *
     */
    monthlyTotal: function(currency, month) {

        return model.aggregate([this.getMatch(currency, month),
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: 
                        { 
                            $multiply: ["$item_cost", "$units_bought"]
                        }    
                    }
                }
            }
        ]).exec();
    },
};