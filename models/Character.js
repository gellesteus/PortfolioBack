import mongoose from 'mongoose';

export default mongoose.model(
	'character',
	mongoose.Schema({
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
	})
);
