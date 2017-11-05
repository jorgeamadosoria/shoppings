var model = require('../data/user');

module.exports = {

    insert: function(obj) {
        return model.create(obj);
    },

    update: function(id, obj) {
        obj._id = mongoose.Types.ObjectId(id);
        console.log(obj.role);
        return model.findByIdAndUpdate(obj._id, { $set: { role: obj.role } }).exec();
    },

    delete: function(id) {
        return model.findByIdAndRemove(mongoose.Types.ObjectId(id)).exec();
    },

    list: function() {
        return model.find().sort({ "google.name": 'asc' }).exec();
    },

    findById: function(id) {
        return model.findById(mongoose.Types.ObjectId(id)).exec();
    }


};