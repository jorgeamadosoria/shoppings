mongoose = require('./connect');
var utils = require('./utils');
var _ = require("underscore");
var paginate = require('mongoose-paginate');
var mongoose_csv = require('mongoose-csv');

/**
 * Item
 * @requires connect
 * @requires underscore
 * @requires mongoose-csv
 * @requires mongoose-paginate
 * @requires utils
 * @typedef {Object} Item
 * @property {string} date - date of this buy
 * @property {string} product - product bought
 * @property {string} brand - a reference to an object from the list of brands
 * @property {string} upp - units in the product bought, if applicable
 * @property {string} weight - weight of the product bought, if applicable
 * @property {string} unit - the unit of measurement of this item
 * @property {string} units_bought - amount of items bought.
 * @property {string} monthly - a value from the list of monthly payments
 * @property {string} unit_cost - unit cost of the product. The item cost would be unit cost times weight
 * @property {string} item_cost - item cost in the currency used
 * @property {string} reason - a value from the list of reasons
 * @property {boolean} good_buy - a true / false value indicating that the item was a good buy
 * @property {boolean} promotion - a true / false value indicating that the item is promotional
 * @property {Address} address - A reference to an object from the list of addresses
 * @property {string} type - a value from the list of types
 * @property {string} category - a value from the list of categories
 * @property {string} comments - a brief comment on the item, promotion or reasoning for the buy
 * @property {string} currency - a value from the list of currencies
 * 
 */
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