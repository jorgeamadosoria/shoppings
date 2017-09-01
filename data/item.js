mongoose = require('./connect');
lists = require('./lists');


var ItemSchema = new mongoose.Schema({
    "date": {
        type: Date,
        default: Date.now
    },
    "product": {
        type: String,
        default: ""
    },
    "brand": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    "upp": {
        type: Number,
        default: 0
    },
    "weight": {
        type: Number,
        default: 0
    },
    "unit": {
        type: String,
        default: ""
    },
    "units_bought": {
        type: Number,
        default: 0
    },
    "unit_cost": {
        type: Number,
        default: 0
    },
    "item_cost": {
        type: Number,
        default: 0
    },
    "reason": {
        type: String,
        default: ""
    },
    "good_buy": {
        type: Boolean,
        default: false
    },
    "promotion": {
        type: Boolean,
        default: false
    },
    "address": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    "type": {
        type: String,
        default: ""
    },
    "category": {
        type: String,
        default: ""
    },
    "comments": {
        type: String,
        default: ""
    },
    "currency": {
        type: String,
        default: ""
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

module.exports = mongoose.model("Item", ItemSchema);