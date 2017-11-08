var model = require('../data/list');
var _ = require("underscore");

/**
 * @fileOverview CRUD serivce for mongoose queries for the lists object
 *
 * @requires data/list
 * @requires underscore 
 * @exports module
 */
module.exports = {

    /**
     * This function insert or updates an entity
     *
     * @param {List} obj - entity to upsert. If the entity has id it will be updated, if not, it will be inserted
     * @param {Number} id - id of the object to update. Optional, if it is undefined, the entity will be inserted
     * @return {Object} a promise for the operation
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
     * This function returns one particular list by name. The list is lean, since it only contains string values
     *
     * @return {Object} a promise for this operation
     *
     */
    findList: function(name) {
        return model.find({ name: name }).lean().exec();
    },

    /**
     * This function transforms a list of List objects inth one ListObject 
     * where each list is a property, identified by its name
     *
     * @return {Object} a promise for this operation
     *
     */
    listsObject: function(lists) {
        var response = {};

        _.forEach(lists, (e) => response[e.name] = e.values);
        return response;
    },

    /**
     * This function returns one entity by id
     *
     * @return {Object} a promise for this operation
     *
     */
    findById: function(id) {
        return model.findById(mongoose.Types.ObjectId(id)).lean().exec();
    }
};