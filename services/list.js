var model = require('../data/list');
var _ = require("underscore");

module.exports = {

    insert: function(obj) {
        console.log("insert" + JSON.stringify(obj));
        if (obj.values)
            obj.values = obj.values.split(",");
        console.log("insert " + obj.values);
        return model.create(obj);
    },

    update: function(id, obj) {
        obj._id = mongoose.Types.ObjectId(id);
        if (obj.values)
            obj.values = obj.values.split(",");
        console.log("update " + obj.values);
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

    findList: function(name) {
        return model.find({name:name}).lean().exec();
    },

    listsObject: function(lists) {
        var response = {};

        _.forEach(lists, (e) => response[e.name] = e.values);
        return response;
    },

    findById: function(id) {
        return model.findById(mongoose.Types.ObjectId(id)).lean().exec();
    }
};