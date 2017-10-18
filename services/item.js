var model = require('../data/item');
var _ = require("underscore");
var moment = require('moment');

module.exports = {

    insert: function(obj) {

        if (obj.brand)
            obj.brand = mongoose.Types.ObjectId(obj.brand);
        if (obj.address) {
            obj.address = mongoose.Types.ObjectId(obj.address);
        }
        return model.create(obj);
    },

    update: function(id, obj) {

        obj.good_buy = (obj.good_buy) ? true : false;
        obj.promotion = (obj.promotion) ? true : false;

        obj._id = mongoose.Types.ObjectId(id);


        if (obj.brand)
            obj.brand = mongoose.Types.ObjectId(obj.brand);
        if (obj.address) {
            obj.address = mongoose.Types.ObjectId(obj.address);
        }

        return model.findByIdAndUpdate(obj._id, obj, {
            new: true
        }).populate("brand").populate("address").exec();
    },

    delete: function(id) {
        var _id = mongoose.Types.ObjectId(id);
        return model.findByIdAndRemove(_id).exec();
    },

    list: function(query) {
        return model.find(this.buildQuery(query)).populate("brand").populate("address").exec();
    },
    csv: function(res) {
        return model.find().populate("brand").populate("address").csv(res);
    },
    buildQuery: function(clientQuery) {

        var _in = function(query, clientQuery, field) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length) {
                    query[field] = {};
                    query[field]["$in"] = _.map(clientQuery[field].fields, (ele) => ele.key);
                }
            }
        };

        var _regexp = function(query, clientQuery, field) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length && clientQuery[field].fields[0].value) {
                    query[field] = {};
                    query[field] = new RegExp(clientQuery[field].fields[0].value);
                }
            }
        };

        var _bool = function(query, clientQuery, field) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length && clientQuery[field].fields[0].value) {
                    query[field] = {};
                    query[field] = clientQuery[field].fields[0].value;
                }
            }
        };

        var _date = function(query, clientQuery, field) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length) {
                    _.each(clientQuery[field].fields, (ele) => {
                        if (ele.key === 'to' && ele.value) {
                            query[field] = {};
                            query[field]["$lte"] = moment(ele.value).format("YYYY-MM-DD");
                        }
                        if (ele.key === 'from' && ele.value) {
                            if (!query[field])
                                query[field] = {};
                            query[field]["$gte"] = moment(ele.value).format("YYYY-MM-DD");
                        }
                    });
                }
            }
        };

        var _range = function(query, clientQuery, field) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length) {
                    _.each(clientQuery[field].fields, (ele) => {
                        if (ele.key === 'to' && ele.value) {
                            query[field] = {};
                            query[field]["$lte"] = ele.value;
                        }
                        if (ele.key === 'from' && ele.value) {
                            if (!query[field])
                                query[field] = {};
                            query[field]["$gte"] = ele.value;
                        }
                    });
                }
            }
        };

        var _weight = function(query, clientQuery, field, field2) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length) {
                    _.each(clientQuery[field].fields, (ele) => {
                        if (ele.key === 'to' && ele.value) {
                            query[field] = {};
                            query[field]["$lte"] = ele.value;
                        }
                        if (ele.key === 'from' && ele.value) {
                            if (!query[field])
                                query[field] = {};
                            query[field]["$gte"] = ele.value;
                        }
                        if (ele.key === 'value' && ele.value) {
                            query[field2] = {};
                            query[field2] = ele.value;
                        }
                    });
                }
            }
        };


        var query = {};

        _date(query, clientQuery, "date");
        _regexp(query, clientQuery, "product");
        _regexp(query, clientQuery, "comments");
        _in(query, clientQuery, "monthly");
        _in(query, clientQuery, "brand");
        _in(query, clientQuery, "address");
        _in(query, clientQuery, "category");
        _in(query, clientQuery, "reason");
        _in(query, clientQuery, "monthly");
        _in(query, clientQuery, "currency");
        _range(query, clientQuery, "upp");
        _range(query, clientQuery, "units_bought");
        _range(query, clientQuery, "unit_cost");
        _range(query, clientQuery, "item_cost");
        _range(query, clientQuery, "item_cost");
        _weight(query, clientQuery, "weight", "unit");
        _bool(query, clientQuery, "promotion");
        _bool(query, clientQuery, "good_buy");

        return query;
    },

    paginate: function(query) {

        //   console.log("query " + JSON.stringify(query));
        return model.paginate(this.buildQuery(query), {
            page: query.page, //query.page?query.page:1,
            limit: 10, //query.limit?query.limit:10,
            sort: {
                date: 'desc'
            },
            populate: ["brand", "address"]
        });
    },

    findById: function(id) {
        var _id = mongoose.Types.ObjectId(id);
        return model.findById(_id).exec();
    },

    monthlyList: function() {
        return model.aggregate([{ $group: { _id: "$monthly", lastDate: { $max: "$date" } } }]).exec();
    }



};