import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username is required'],
	},
	created: {
		type: Date,
		default: Date.now,
	},
	lastOnline: {
		type: Date,
		default: Date.now,
	},
	sessionToken: {
		type: String,
		default: null,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
	},
	mustChangePassword: {
		type: Boolean,
		default: false,
	},
	role: {
		type: String,
		default: 'user',
	},
	validated: {
		type: Boolean,
		default: false,
	},
	fileCount: {
		type: Number,
		default: 0,
	},
	files: {
		type: [String],
		default: [],
	},
});

schema.pre('validate', function(next) {
	User.findOne({ email: this.email, _id: { $ne: this._id } }).then(user => {
		if (user) {
			next(new Error('Email is already in use'));
		} else {
			next();
		}
	});
});

schema.pre('validate', function(next) {
	User.findOne({ username: this.username, _id: { $ne: this._id } }).then(
		user => {
			if (user) {
				if (user._id == this._id) {
					/* Only found this model */
					next();
				} else {
					next(new Error('Username is already in use'));
				}
			} else {
				next();
			}
		}
	);
});

const User = mongoose.model('user', schema);

export default User;
