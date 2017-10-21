var _ = require("underscore");
var moment = require("moment");

module.exports = {

    loggedRole: function(roles) {
        return function(req, res, next) {
           res.locals.user = req.user;
            if (req.user && req.isAuthenticated() && _.contains(roles, req.user.role))
                return next();
            res.redirect('/login');
      //      res.locals.user = {google:{name:"DEBUG",email:"email"},role:"admin"};
      //      return next();
        }
    },

    median: function(values) {

        values.sort(function(a, b) {
            return a - b;
        });

        var half = Math.floor(values.length / 2);

        if (values.length % 2)
            return values[half];
        else
            return (values[half - 1] + values[half]) / 2.0;
    },

    round: function(value, decimals) {
        return isNaN(value) ? value : (Number.isInteger(value) ? (value + ".00") : Number(Math.round(value + 'e' + decimals) + 'e-' + decimals));
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
    },
    currentMonth: function(date, today, notToday, options) {
            return (moment(date).utc().format("MM") == moment().utc().format("MM")) ? today : notToday;
    }
};