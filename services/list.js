var model = require('../data/list');
var _ = require("underscore");

module.exports = {

 /**
     * This function insert or updates an entity
     *
     * @param {List} obj - entity to upsert. If the entity has id it will be updated, if not, it will be inserted
     * @param {Number} id - id of the object to update. Optional, if it is undefined, the entity will be inserted
     * @return {Object} a promise for the insert operation
     *
     */
    upsert: function(obj, id) {
        if (id === undefined)
        {
            if (obj.values)
                obj.values = obj.values.split(",");
            return model.create(obj);
        }
        else {
            obj._id = mongoose.Types.ObjectId(id);
            if (obj.values)
                obj.values = obj.values.split(",");
            return model.findByIdAndUpdate(obj._id, obj).exec();
        }
    },

    /**
     * This function deletes an entity
     *
     * @param {Number} id - id of the object to delete.
     * @return {Object} a promise for this operation
     *
     */
    delete: function(id) {
        return model.findByIdAndRemove(mongoose.Types.ObjectId(id)).exec();
    },

    list: function() {
        return model.find().sort({
            name: 'asc'
        }).lean().exec();
    },

    findList: function(name) {
        return model.find({ name: name }).lean().exec();
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