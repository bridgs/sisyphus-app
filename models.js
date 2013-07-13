var mongoose = require('mongoose');
var crypto = require('crypto');
var User;
var emailValidators;

function isStringDefined(val) {
	return val && val.length;
}
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}

emailValidators = [
	{ validator: isStringDefined, msg: 'e-mail address required' },
	{ validator: isValidEmailAddress, msg: 'must be valid e-mail address' }
];

var userSchema = new mongoose.Schema({
	dateCreated: { type: Date, default: Date.now },
	email: { type: String, required: true, validate: emailValidators, index: { unique: true }},
	hashedPassword: { type: String, required: true },
	salt: { type: String, required: true }
});
userSchema.virtual('password').get(function() {
	return this.hashedPassword;
}).set(function(password) {
	this.salt = crypto.createHmac('sha1', 'nosaltreqd').update(Math.random() + '_' + this.dateCreated.getTime()).digest('hex');
	this.hashedPassword = this.hashPassword(password);
});
userSchema.method('authenticate', function(password) {
	return this.hashPassword(password) === hashedPassword;
});
userSchema.method('hashPassword', function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});
userSchema = mongoose.model('User', userSchema);

exports.User = User;