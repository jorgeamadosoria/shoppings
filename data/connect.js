var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var mongodburl = "mongodb://localhost:27017/shoppings";

if (process.env.MONGODB_URI){
    mongodburl = process.env.MONGODB_URI;
  }


var promise = mongoose.connect(mongodburl, {
    useMongoClient: true,
    /* other options */
  });

  promise.then(function(db) {
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  });

module.exports = mongoose;