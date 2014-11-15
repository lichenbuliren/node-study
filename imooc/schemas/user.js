var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

UserSchema.pre('save', function (next) {
	var user = this;
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) {
			console.log("bcrypt genSalt err : " + err);
			return next(err);
		}
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) {
				console.log('hash password err:' + err);
				return next(err);
			}
			user.password = hash;
			console.log("hashed password is :" + user.password);
			next();
		});
	});
});

// 实例方法
UserSchema.methods = {
	comparePassword: function (_password, cb) {
		bcrypt.compare(_password, this.password, function (err, isMatch) {
			if (err) {
				console.log('compare bcrypt password err' + err);
				return cb(err);
			}
			cb(null, isMatch);
		});
	}
}

// 静态方法，在model层可以调用
UserSchema.statics = {
	fetch: function (cb) {
		return this.find({}).sort("meta.updateAt").exec(cb);
	},
	findById: function (id, cb) {
		return this.findOne({
			_id: id
		}).exec(cb);
	}
}

module.exports = UserSchema;