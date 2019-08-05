import mongoose from 'mongoose';

export default mongoose.model(
	'organization',
	mongoose.Schema({
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
	})
);
