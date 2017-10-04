var _ = require("underscore");

module.exports = {

    currencies: ["UYU", "USD", "CUC", "CUP", "ARS", "CLP", "NA"],

    effectiveCurrencies: ["UYU", "USD", "CUC", "CUP", "ARS", "CLP"],

    status: { "Promotion": "fa fa-thumbs-up text-success", "Good buy": "fa fa-thumbs-o-up text-success", "Bad buy": "fa fa-thumbs-o-down text-danger", "Missing data": "fa fa-warning text-warning" },

    countries: ["Panamá", "Uruguay", "Chile", "Argentina", "Cuba", "NA"],

    categories: ["Food", "Bills", "Clothing", "Electronics", "Household", "Entertainment", "Transportation", "Health", "Housing", "Communications", "Personal", "Support", "Legal", "Causes", "Education", "Debt", "Gifts", "Charity", "Luxury", "Esthetic", "NA"],

    reasons: ["Need", "Want", "Exploration", "Amal", "Lunch", "Dinner", "Breakfast", "Error", "NA"],

    monthly: ["Netflix", "Rent", "Itaú", "Movistar", "Antel", "UTE"],

    types: ["Product", "Service", "Contribution", "Payment", "NA"],

    units: ["NA", "kg", "cc", "g", "mg", "m", "lt", "ml", "cc", "cm^2", "cm"],

    prepare: function(list, item) {
        var temp = list.slice();
        temp.splice(list.indexOf(item), 1);
        return temp;
    },
    prepareObj: function(list, obj) {
        if (obj) {
            var temp = [];
            list.forEach(function(element) {
                if (!_.isEqual(element._id, obj._id))
                    temp.push(element);
            });
            return temp;
        } else
            return list.slice();
    },
    stripNAorNull: function(list) {
        var temp = [];
        list.forEach(function(element) {
            if (!_.isEqual(element._id, "NA") && !_.isEqual(element._id, null))
                temp.push(element);
        });
        return temp;
    }
};