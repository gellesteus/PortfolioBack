import mongoose from 'mongoose';

export default mongoose.model(
	'post',
	new mongoose.Schema({
		body: {
			/* Will reference a post that is to be displayed as the body of the first post of the topic */
			type: String,
			required: [true, 'A body is required'],
		},
		category: {
			type: mongoose.Schema.ObjectId,
			required: [true, 'A post must belong to a category'],
		},
		topic: {
			type: mongoose.Schema.ObjectId,
			required: [true, 'A post must belong to a topic'],
		},
		poster: {
			type: mongoose.Schema.ObjectId,
			required: [true, 'A post must have a poster'],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		update: {
			type: Boolean,
			deafult: false,
		},
		updatedAt: {
			type: Date,
			default: null,
		},
	})
);
