var model = require('../data/query');

module.exports = {

    insert: function(obj) {
        console.log("insert" + JSON.stringify(obj));
        return model.create(obj);
    },

    update: function(id, obj) {
        obj._id = mongoose.Types.ObjectId(id);
        return model.findByIdAndUpdate(obj._id, obj).exec();
    },

    delete: function(id) {
        return model.findByIdAndRemove(mongoose.Types.ObjectId(id)).exec();
    },

    list: function() {
        return model.find().sort({ name: 'asc' }).lean().exec();
    },

    findById: function(id) {
        return model.findById(mongoose.Types.ObjectId(id)).lean().exec();
    }
};