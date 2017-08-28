var model = require('../data/item');

module.exports = {

    insert: function (obj) {
        if (obj.brand)
            obj.brand = mongoose.Types.ObjectId(obj.brand);
        console.log("Address:" + obj.address);
        if (obj.address) {
            console.log("Address:" + obj.address);
            obj.address = mongoose.Types.ObjectId(obj.address);
        }
        return model.create(obj);
    },

    update: function (id, obj) {
        obj._id = mongoose.Types.ObjectId(id);
        if (obj.brand)
            obj.brand = mongoose.Types.ObjectId(obj.brand);
        if (obj.address) {
            console.log("Address:" + obj.address);
            obj.address = mongoose.Types.ObjectId(obj.address);
        }


        return model.findByIdAndUpdate(obj._id, obj).exec();
    },

    delete: function (id) {
        var _id = mongoose.Types.ObjectId(id);
        return model.findByIdAndRemove(_id).exec();
    },

    list: function () {
        return model.find().populate("brand").populate("address").exec();
    },

    findById: function (id) {
        var _id = mongoose.Types.ObjectId(id);
        return model.findById(_id).populate("brand", "address").exec();
    }
};