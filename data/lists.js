var s = require("underscore");

module.exports = {

    currencies: ["UYU", "USD", "CUC", "CUP", "ARS", "CLP", "N/A"],

    status: ["fa fa-check-circle-o text-success", "fa fa-warning text-warning"],

    countries: ["Uruguay", "Chile", "Argentina", "Cuba", "N/A"],

    categories: ["Food", "Bills", "Clothing", "Electronics", "Household", "Entertainment", "Transportation", "Health", "Housing", "Communications", "Personal", "Support", "Legal", "Education", "Debt", "Gifts", "Charity", "Luxury", "Esthetic", "N/A"],

    reasons: ["Need", "Want", "Exploration", "Amal", "Lunch", "Dinner", "Breakfast", "Error", "N/A"],

    types: ["Product", "Service", "Contribution", "Payment", "N/A"],

    units: ["kg", "cc", "g", "mg", "m", "lt", "ml", "cc", "kg+", "-kg", "cm^2", "cm", "N/A"],

    prepare: function(list, item) {
        var temp = list.slice();
        temp.splice(list.indexOf(item), 1);
        return temp;
    },
    prepareObj: function(list, obj) {
        if (obj) {
            var temp = [];
            list.forEach(function(element) {
                if (!s.isEqual(element._id, obj._id))
                    temp.push(element);
            });
            return temp;
        } else
            return list.slice();
    }
};