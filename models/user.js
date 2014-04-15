var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true, unique: true, index: true, display: {help: 'This must be a unique name'}},
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String},
    password: {type: String},
    created_at: {type: Date},
    modified_at: {type: Date}
});

UserSchema.pre('save', function(next) {
    var _this = this;
   if (this._doc.password && this.password != '_default_') {
        this.password = sha1b64(this.password);
    }
    if (this.isNew)
        this.created_at = Date.now();
    else
        this.modfied_at = Date.now();
    next(); 
});

function sha1b64(password) {
    return crypto.createHash('sha1').update(password).digest('base64');
}

// assign a function to the "methods" object of our UserSchema.We are using Statics to search for all documents not the instance of it.
UserSchema.statics.findByUsernamePassword = function(username, password, callback) {
    return this.findOne({username: username, password: sha1b64(password)}, callback);
};

/*compile schema to a model*/
var User = mongoose.model('user', UserSchema);

/*expose this variable to other js file */
module.exports = User;




