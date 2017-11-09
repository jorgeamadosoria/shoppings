var chai = require('chai');

describe('Reports Service', function() {
            it('calculates the daily expense total for a given month', function() {
                // Test implementation goes here
            });

            it('calculates the data for the categories chart for a given month', function() {
                // Test implementation goes here
            });

            it('calculates the data for the reasons chart for a given month', function() {
                // Test implementation goes here
            });





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
                                _id: null,
                                total: {
                                    $sum: {
                                        $multiply: ["$item_cost", "$units_bought"]
                                    }
                                }
                            }
                        }
                    ]).exec();
                },
        };