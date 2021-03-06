var model = require('../data/brand');

/**
 * @fileOverview CRUD serivce for mongoose queries for brands
 *
 * @requires data/brand
 * 
 * @exports module
 */
module.exports = {

    /**
     * This function insert or updates an entity
     *
     * @param {Brand} obj - entity to upsert. If the entity has id it will be updated, if not, it will be inserted
     * @param {Number} id - id of the object to update. Optional, if it is undefined, the entity will be inserted
     * @return {Object} a promise for this operation
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
        return model.find().sort({ name: 'asc' }).lean().exec();
    },

    /**
     * This function returns one entity by id
     *
     * @return {Object} a promise for this operation
     *
     */
    findById: function(id) {
        return model.findById(mongoose.Types.ObjectId(id)).lean().exec();
    },

    /**
     */
    findByName: function(name) {
       return model.find({ name: new RegExp(name, 'i') }).lean().exec();
    }
};