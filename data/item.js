mongoose = require('./connect');
var utils = require('./utils');
var _ = require("underscore");
var paginate = require('mongoose-paginate');
var mongoose_csv = require('mongoose-csv');

var ItemSchema = new mongoose.Schema({
    "date": {
        type: Date,
        default: Date.now,
        search: "date-search"
    },
    "product": {
        type: String,
        default: "",
        search: "string-search"
    },
    "brand": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        search: "brands-search"
    },
    "upp": {
        type: Number,
        default: 0,
        search: "number-search"
    },
    "weight": {
        type: Number,
        default: 0,
        search: "weight-search"
    },
    "unit": {
        type: String,
        default: "",
    },
    "units_bought": {
        type: Number,
        default: 0,
        search: "number-search"
    },
    "monthly": {
        type: String,
        ref: "",
        search: "monthly-search"
    },
    "unit_cost": {
        type: Number,
        default: 0,
        search: "currency-search"
    },
    "item_cost": {
        type: Number,
        default: 0,
        search: "currency-search"
    },
    "reason": {
        type: String,
        default: "",
        search: "reasons-search"
    },
    "good_buy": {
        type: Boolean,
        default: false,
        search: "boolean-search"
    },
    "promotion": {
        type: Boolean,
        default: false,
        search: "boolean-search"
    },
    "address": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        search: "addresses-search"
    },
    "type": {
        type: String,
        default: "",
        search: "types-search"
    },
    "category": {
        type: String,
        default: "",
        search: "categories-search"
    },
    "comments": {
        type: String,
        default: "",
        search: "string-search"
    },
    "currency": {
        type: String,
        default: "",
        search: "currencies-search"
    },
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});


ItemSchema.virtual('totalItemCost')
    .get(function() {
        if (this.units_bought && this.item_cost)
            return utils.round(this.units_bought * this.item_cost, 2);
        return null;
    });

ItemSchema.methods.toSearchObject = function() {
    //   console.log(this.schema.paths);
    //  console.log(_.filter(_.map(this.schema.paths, k => { return { path: k.path, search: k.options.search, type: k.instance }; }), v => !v.path.startsWith("_")));
    return _.filter(_.map(this.schema.paths, k => { return { path: k.path, search: k.options.search, type: k.instance }; }), v => v.search && !v.path.startsWith("_"));
};

ItemSchema.plugin(paginate);
ItemSchema.plugin(mongoose_csv);

module.exports = mongoose.model("Item", ItemSchema);