import mongoose from 'mongoose';

export default mongoose.model(
	'item',
	mongoose.Schema({
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		shortDesc: {
			type: String,
			required: [true, 'Description is required'],
		},
		longDesc: {
			type: String,
			required: [true, 'Description is required'],
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
		images: {
			type: [String],
			default: [],
		},
	})
);
