var model = require('../data/query');

/**
 * @fileOverview CRUD serivce for mongoose queries for query objects
 *
 * @requires data/query
 * 
 * @exports module
 */
module.exports = {

    /**
     * This function insert or updates an entity
     *
     * @param {Query} obj - entity to upsert. 
     * @param {Number} id - id of the object to update. Optional, if it is undefined, the entity will be inserted
     * @return {Object} a promise for the operation
     *
     */
    upsert: function(obj, id) {
        if (id === undefined)
            return model.create(obj);
        else {
            obj._id = mongoose.Types.ObjectId(id);
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

    /**
     * This function lists all entities in alphabethical order
     *
     * @return {Object} a promise for this operation
     *
     */
    list: function() {
        return model.find().sort({
            name: 'asc'
        }).lean().exec();
    },

    /**
     * This function returns one entity by id
     *
     * @return {Object} a promise for this operation
     *
     */
    findById: function(id) {
        //   console.log("findById "+ id);
        return model.findById(mongoose.Types.ObjectId(id)).lean().exec();
    }
};