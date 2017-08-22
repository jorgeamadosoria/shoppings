var mongoose = require('mongoose');

var promise = mongoose.connect('mongodb://127.0.0.1:27017/shoppings', {
    useMongoClient: true,
    /* other options */
  });

  promise.then(function(db) {
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  });

module.exports = mongoose;