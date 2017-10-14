var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');
var lists = require('./data/lists');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');


var Handlebars = require('hbs');

Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});


Handlebars.registerHelper('round', lists.round);


Handlebars.registerHelper('map', function(obj, options) {
    return options.fn(Object.keys(obj).map((k) => {
        return {
            key: k,
            val: obj[k]
        };
    }));
});

Handlebars.registerHelper('currentMonth', function(date, today, notToday, options) {
    return (moment(date).utc().format("MM") == moment().utc().format("MM")) ? today : notToday;
});

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

Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if (lvalue != rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

Handlebars.registerPartials(path.join(__dirname, 'views/partials'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/brands', require('./routes/brands'));
app.use('/addresses', require('./routes/addresses'));
app.use('/items', require('./routes/items'));
app.use('/queries', require('./routes/queries'));
app.use('/lists', require('./routes/lists'));
app.use('/reports', require('./routes/reports'));
app.use('/reports', require('./routes/reports'));


//for passport, following tutorial: https://scotch.io/tutorials/easy-node-authentication-setup-and-local
app.use(session({ secret: 'shoppingSecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());


module.exports = function(app, passport) {

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

};

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
*/
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;