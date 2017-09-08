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
            console.log("Address:" + obj.address);
            obj.address = mongoose.Types.ObjectId(obj.address);
        }


        return model.findByIdAndUpdate(obj._id, obj, { new: true }).populate("brand").populate("address").exec();
    },

    delete: function(id) {
        var _id = mongoose.Types.ObjectId(id);
        return model.findByIdAndRemove(_id).exec();
    },

    list: function(query) {
        return this.parsed(query).populate("brand").populate("address").exec();
    },

    findById: function(id) {
        var _id = mongoose.Types.ObjectId(id);
        return model.findById(_id).populate("brand").populate("address").exec();
    },

    parsed: function(clientQuery) {
        console.log(clientQuery);
        var _in = function(moongoseQ, clientQuery, field) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length) {
                    moongoseQ.where(field).in(_.map(clientQuery[field].fields, (ele) => ele.key));
                }
            }
        };

        var _regexp = function(moongoseQ, clientQuery, field) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length && clientQuery[field].fields[0].value)
                    moongoseQ.where(field).equals(new RegExp(clientQuery[field].fields[0].value));
            }
        };

        var _date = function(moongoseQ, clientQuery, field) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length) {
                    _.each(clientQuery[field].fields, (ele) => {
                        if (ele.key === 'to' && ele.value) {
                            moongoseQ.where(field).lte(moment(ele.value).format("YYYY-MM-DD"));
                        }
                        if (ele.key === 'from' && ele.value) {
                            moongoseQ.where(field).gte(moment(ele.value).format("YYYY-MM-DD"));
                        }
                    });
                }
            }
        };

        var _range = function(moongoseQ, clientQuery, field) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length) {
                    _.each(clientQuery[field].fields, (ele) => {
                        if (ele.key === 'to' && ele.value) {
                            moongoseQ.where(field).lte(ele.value);
                        }
                        if (ele.key === 'from' && ele.value) {
                            moongoseQ.where(field).gte(ele.value);
                        }
                    });
                }
            }
        };

        var _weight = function(moongoseQ, clientQuery, field, field2) {
            if (clientQuery[field]) {
                if (clientQuery[field].fields.length) {
                    _.each(clientQuery[field].fields, (ele) => {
                        if (ele.key === 'to' && ele.value) {
                            moongoseQ.where(field).lte(ele.value);
                        }
                        if (ele.key === 'from' && ele.value) {
                            moongoseQ.where(field).gte(ele.value);
                        }
                        if (ele.key === 'value' && ele.value) {
                            moongoseQ.where(field2).equals(ele.value);
                        }
                    });
                }
            }
        };


        var moongoseQ = model.find({});
        console.log("mongoose " + JSON.stringify(clientQuery));
        _date(moongoseQ, clientQuery, "date");
        _regexp(moongoseQ, clientQuery, "product");
        _regexp(moongoseQ, clientQuery, "comments");
        _in(moongoseQ, clientQuery, "brand");
        _in(moongoseQ, clientQuery, "address");
        _in(moongoseQ, clientQuery, "category");
        _in(moongoseQ, clientQuery, "currency");
        _range(moongoseQ, clientQuery, "upp");
        _range(moongoseQ, clientQuery, "units_bought");
        _range(moongoseQ, clientQuery, "unit_cost");
        _range(moongoseQ, clientQuery, "item_cost");
        _range(moongoseQ, clientQuery, "item_cost");
        _weight(moongoseQ, clientQuery, "weight", "unit");
        /*
                if (clientQuery.) {
                    if (clientQuery..fields.length) {
                        moongoseQ.where("brand").in(_.map(clientQuery..fields, (ele) => ele.key));
                    }
                }
        */
        //   console.log("after " + JSON.stringify(mongooseQ));
        return moongoseQ;
    }

};