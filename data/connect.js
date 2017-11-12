var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var promise = mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL +
  process.env.OPENSHIFT_APP_NAME, {
    useMongoClient: true,
    /* other options */
  });

  promise.then(function(db) {
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  });

module.exports = mongoose;