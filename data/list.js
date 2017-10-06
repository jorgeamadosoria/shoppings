mongoose = require('./connect');

var ListSchema = new mongoose.Schema({
    "name": {
        type: String,
        default: "",
    },
    "values": {
        type: []

    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

ListSchema.methods.prepare =
    function(item) {
        var temp = this.values.slice();
        temp.splice(this.values.indexOf(item), 1);
        return temp;
    };


module.exports = mongoose.model("List", ListSchema);