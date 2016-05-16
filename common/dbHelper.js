var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    userModel= {
        name: { type: String, required: true },
        password: { type: String, required: true },
        trip: { type: Array}
    };
mongoose.model('user', new Schema(userModel));
module.exports = {
    getModel: function (type) {
        return _getModel(type);
    }
};
var _getModel = function (type) {
    return mongoose.model(type);
};


