import mongoose from 'mongoose';
import Character from './Character';
import Location from './Location';

export default mongoose.model(
	'organization',
	mongoose.Schema({
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: Character,
			},
		],
		holdings: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: Location,
			},
		],
		shortDesc: {
			type: String,
			required: [true, 'Short description is required'],
		},
		longDesc: {
			type: String,
			required: [true, 'Long description is required'],
		},
	})
);
