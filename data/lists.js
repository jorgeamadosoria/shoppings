var _ = require("underscore");

module.exports = {


    effectiveCurrencies: ["UYU", "USD", "CUC", "CUP", "ARS", "CLP"],

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