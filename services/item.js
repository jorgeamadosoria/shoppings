var model = require('../data/item');

module.exports = {

    insert: function(obj) {
        if (obj.brand)
            obj.brand = mongoose.Types.ObjectId(obj.brand);
        if (obj.address) {
            obj.address = mongoose.Types.ObjectId(obj.address);
        }
        return model.create(obj);
    },

    update: function(id, obj) {

        obj.good_buy = (obj.good_buy) ? true : false;
        obj.promotion = (obj.promotion) ? true : false;

        obj._id = mongoose.Types.ObjectId(id);
        if (obj.brand)
            obj.brand = mongoose.Types.ObjectId(obj.brand);
        if (obj.address) {
            console.log("Address:" + obj.address);
            obj.address = mongoose.Types.ObjectId(obj.address);
        }


        return model.findByIdAndUpdate(obj._id, obj,{new:true}).populate("brand").populate("address").exec();
    },

    delete: function(id) {
        var _id = mongoose.Types.ObjectId(id);
        return model.findByIdAndRemove(_id).exec();
    },

    list: function(query) {
        return model.find(query).populate("brand").populate("address").exec();
    },

    findById: function(id) {
        var _id = mongoose.Types.ObjectId(id);
        return model.findById(_id).populate("brand").populate("address").exec();
    }
};