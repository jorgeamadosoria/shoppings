var model = require('../data/user');

module.exports = {

    /**
     * This function insert or updates an entity. In this case only the role can be updated
     *
     * @param {User} obj - entity to upsert. 
     * @param {Number} id - id of the object to update. Optional, if it is undefined, the entity will be inserted
     * @return {Object} a promise for the insert operation
     *
     */
    upsert: function(obj, id) {
        if (id === undefined)
            return model.create(obj);
        else {
            obj._id = mongoose.Types.ObjectId(id);
            return model.findByIdAndUpdate(obj._id, { $set: { role: obj.role } }).exec();
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
        return model.find().sort({ "google.name": 'asc' }).exec();
    },

    findById: function(id) {
        return model.findById(mongoose.Types.ObjectId(id)).exec();
    }


};