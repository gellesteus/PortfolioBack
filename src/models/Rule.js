import mongoose from 'mongoose';

export default mongoose.model(
	'rule',
	mongoose.Schema({
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		shortDesc: {
			type: String,
			required: [true, 'Short description is required'],
		},
		longDesc: {
			type: String,
			requires: [true, 'Long description is required'],
		},
	})
);
