mongoose = require('./connect');
lists = require('./lists');
var _ = require("underscore");

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

ItemSchema.virtual('stringStatus')
    .get(function() {

        if ((this.date && this.product && this.brand && this.units_bought && this.item_cost && this.reason && this.address && this.type &&
                this.category && this.currency) && ((this.weight && (this.unit && this.unit != 'N/A') &&
                this.unit_cost) || (!this.weight && (!this.unit || this.unit == 'N/A') && !this.unit_cost))) {
            return (this.good_buy ? (this.promotion ? "Promotion" : "Good buy") : "Bad buy");
        }
        return "Missing data";
    });

ItemSchema.virtual('status')
    .get(function() {
        return lists.status[this.stringStatus];
    });

ItemSchema.virtual('totalItemCost')
    .get(function() {
        if (this.units_bought && this.item_cost)
            return (this.units_bought * this.item_cost).toFixed(2);
        return null;
    });

ItemSchema.methods.toSearchObject = function() {
    //   console.log(this.schema.paths);
    //  console.log(_.filter(_.map(this.schema.paths, k => { return { path: k.path, search: k.options.search, type: k.instance }; }), v => !v.path.startsWith("_")));
    return _.filter(_.map(this.schema.paths, k => { return { path: k.path, search: k.options.search, type: k.instance }; }), v => v.search && !v.path.startsWith("_"));
};

module.exports = mongoose.model("Item", ItemSchema);