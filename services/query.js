var model = require('../data/query');

module.exports = {

    /**
     * This function insert or updates an entity
     *
     * @param {Query} obj - entity to upsert. 
     * @param {Number} id - id of the object to update. Optional, if it is undefined, the entity will be inserted
     * @return {Object} a promise for the insert operation
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