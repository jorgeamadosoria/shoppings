var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');
var utils = require('./data/utils');
var passport = require('passport');
var flash = require('connect-flash');
var _ = require('underscore');
var session = require('express-session');


var Handlebars = require('hbs');

/**
 * This helper takes a date and presents it in the given format, optionally converting to UTC first.
 * utc should be set to true in all instances for this app
 * @param {Date} date - Date to format. It is converted to moment for the formatting task
 * @param {String} format - Date format
 * @param {boolean} utc - Convert to UTC prior to formatting
 */
Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

/**
 * This helper takes an object and stringifies it to present it in JSON format.
 * It is used mostly for debugging
 * @param {Date} context - the object to JSON.stringify
 */
Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

/**
 * This helper takes a number value and rounds it to the specified decimals. Usually 2 decimals for this app
 *
 * @param {Number} number - Number to round up. Usually a currency value
 * @param {Number} decimals - decimal places to round the number param
 */
Handlebars.registerHelper('round', utils.round);

/**
 * This helper takes a number value and rounds it to the specified decimals. Usually 2 decimals for this app
 *
 * @param {Number} number - Number to round up. Usually a currency value
 * @param {Number} decimals - decimal places to round the number param
 */
Handlebars.registerHelper('map', function(obj, options) {
    return options.fn(Object.keys(obj).map((k) => {
        return {
            key: k,
            val: obj[k]
        };
    }));
});

/**
 * This helper takes no argument and return the current month. Useful to filter current items for the index page
 *
 */
Handlebars.registerHelper('currentMonth', utils.currentMonth);

/**
 * This helper provides the feature of repeating a HTML block an N amount of times.
 * It´s used specifically for pagination purposes 
 * 
 * @param {Number} n - total amount of repetitions
 * @param {Number} step - the numeric step for each of the pagination
 * @param {Number} active - the active page, which serves as an anchor point to render n blocks to each side of it
 *
 */
Handlebars.registerHelper('times', function(n, step, active, options) {
    var accum = '';
    accum += options.inverse(1);
    for (i = Math.max(2, active - step); i <= Math.min(n - 1, active - (-step)); ++i) {
        accum += options.fn(i);
    }
    //to avoid duplicate page button if there is only 1 page
    if (n > 1)
        accum += options.inverse(n);
    return accum;
});

/**
 * This helper takes two arguments and compares then, something that Handlebars does not provide, surprinsingly.
 * It allows conditional rendering of HTML blocks if the values are equal or not.
 * 
 * @param {Number} lvalue - first value to compare
 * @param {Number} rvalue - second value to compare
 *
 */
Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if (lvalue != rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

/**
 * This helper takes one value and a list, and checks if the value is contained in the list.
 * It allows conditional rendering of HTML blocks if the values are equal or not.
 * It´s used to provide conditional rendering if a role is contained in a list of permissible roles.
 * 
 * @param {Number} role - the role to check
 * @param {Number} roles - the list of authorized roles to render
 *
 */
Handlebars.registerHelper('in', function(role, roles, options) {
    //  console.log(options.fn(this));
    if (_.contains(roles.split(","), role)) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerPartials(path.join(__dirname, 'views/partials'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'docs')));

//for passport, following tutorial: https://scotch.io/tutorials/easy-node-authentication-setup-and-local
app.use(session({
    secret: 'shoppingSecret'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
require('./config/passport')(passport);

var indexRouter = require('./routes/index');

indexRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// the callback after google has authenticated the user
indexRouter.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));


app.use('/', indexRouter);
app.use('/brands', require('./routes/brands'));
app.use('/addresses', require('./routes/addresses'));
app.use('/items', require('./routes/items'));
app.use('/queries', require('./routes/queries'));
app.use('/lists', require('./routes/lists'));
app.use('/users', require('./routes/users'));
app.use('/reports', require('./routes/reports'));
app.use('/backup', require('./routes/backup'));



// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/**
 * @fileOverview App configuration including router config, OAuth config, custom modules and Handlebars helpers
 * @requires config/passport
 * @requires hbs
 * @requires express-session
 * @requires underscore
 * @requires connect-flash
 * @requires passport
 * @requires data/utils
 * @requires moment
 * @requires body-parser
 * @requires cookie-parser
 * @requires express
 * @requires path
 * @requires morgan
 * 
 * @exports module
 */
module.exports = app;