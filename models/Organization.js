import mongoose from 'mongoose';

export default mongoose.model(
	'organization',
	mongoose.Schema({
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		known: {
			type: Boolean,
			required: [true, 'Known status is required'],
			default: false,
		},
		members: {
			type: [String],
			required: [true, 'Members are required'],
			default: [],
		},
		description: {
			type: String,
		},
		leader: {
			type: String,
		},
	})
);
