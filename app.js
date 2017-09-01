var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var Handlebars = require('hbs');

Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

Handlebars.registerHelper('map', function(obj, options) {
    return options.fn(Object.keys(obj).map((k) => {
        return {
            key: k,
            val: obj[k]
        };
    }));
});
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

app.use('/', index);
app.use('/brands', require('./routes/brands'));
app.use('/addresses', require('./routes/addresses'));
app.use('/items', require('./routes/items'));
app.use('/reports', require('./routes/reports'));


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

module.exports = app;