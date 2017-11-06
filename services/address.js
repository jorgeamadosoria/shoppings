var model = require('../data/address');

module.exports = {

    /**
     * This function insert or updates an entity
     *
     * @param {Address} obj - entity to upsert. If the entity has id it will be updated, if not, it will be inserted
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
    delete: function (id) {
        return model.findByIdAndRemove(mongoose.Types.ObjectId(id)).exec();
    },

    list: function () {
        //can't use lean because of virtuals
        return model.find().sort({name:'asc'}).exec();

    },

    findById: function (id) {
        return model.findById(mongoose.Types.ObjectId(id)).lean().exec();
    }
};