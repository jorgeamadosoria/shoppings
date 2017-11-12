var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var promise = mongoose.connect(process.env.MONGODB, {
    useMongoClient: true,
    /* other options */
  });

  promise.then(function(db) {
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  });

module.exports = mongoose;