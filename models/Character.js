import mongoose from 'mongoose';

export default mongoose.model(
	'character',
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
		appearance: {
			type: String,
		},
		flaws: {
			type: String,
		},
		goal: {
			type: String,
		},
		mannerism: {
			type: String,
		},
		ideal: {
			type: String,
		},
		secret: {
			type: String,
		},
		bond: {
			type: String,
		},
	})
);
