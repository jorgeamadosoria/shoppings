var model = require('../data/user');

/**
 * @fileOverview CRUD serivce for mongoose queries for users
 *
 * @requires data/user
 * 
 * @exports module
 */
module.exports = {

    /**
     * This function insert or updates an entity. In this case only the role can be updated
     *
     * @param {User} obj - entity to upsert. 
     * @param {Number} id - id of the object to update. Optional, if it is undefined, the entity will be inserted
     * @return {Object} a promise for the operation
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

    /**
     * This function lists all entities in alphabethical order
     *
     * @return {Object} a promise for this operation
     *
     */
    list: function() {
        return model.find().sort({ "google.name": 'asc' }).exec();
    },

    /**
     * This function returns one entity by id
     *
     * @return {Object} a promise for this operation
     *
     */
    findById: function(id) {
        return model.findById(mongoose.Types.ObjectId(id)).exec();
    }


};