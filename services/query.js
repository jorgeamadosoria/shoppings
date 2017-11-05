var model = require('../data/query');

module.exports = {

    insert: function(obj) {
        return model.create(obj);
    },

    update: function(id, obj) {
        obj._id = mongoose.Types.ObjectId(id);
        //        console.log("update "+ JSON.stringify(obj));
        return model.findByIdAndUpdate(obj._id, obj).exec();
    },

    delete: function(id) {
        return model.findByIdAndRemove(mongoose.Types.ObjectId(id)).exec();
    },

    list: function() {
        return model.find().sort({
            name: 'asc'
        }).lean().exec();
    },

    findById: function(id) {
        //   console.log("findById "+ id);
        return model.findById(mongoose.Types.ObjectId(id)).lean().exec();
    }
};