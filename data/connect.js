var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var mongodburl = "mongodb://localhost:27017";

if (process.env.OPENSHIFT_MONGODB_DB_URL &&
  process.env.OPENSHIFT_APP_NAME){
    mongodburl = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
  }


var promise = mongoose.connect(mongodburl, {
    useMongoClient: true,
    /* other options */
  });

  promise.then(function(db) {
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  });

module.exports = mongoose;