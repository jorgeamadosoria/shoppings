var _ = require("underscore");

module.exports = {
    median: function(values) {

        values.sort(function(a, b) { return a - b; });

        var half = Math.floor(values.length / 2);

        if (values.length % 2)
            return values[half];
        else
            return (values[half - 1] + values[half]) / 2.0;
    },

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