import mongoose from 'mongoose';
import Character from './Character';
import Location from './Location';

export interface IOrganization extends mongoose.Document {
  holding: mongoose.Schema.Types.ObjectId[];
  longDesc: string;
  members: mongoose.Schema.Types.ObjectId[];
  name: string;
  shortDesc: string;
}

export default mongoose.model<IOrganization>(
  'organization',
  new mongoose.Schema({
    holdings: [
      {
        ref: Location,
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    longDesc: {
      required: [true, 'Long description is required'],
      type: String
    },
    members: [
      {
        ref: Character,
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    name: {
      required: [true, 'Name is required'],
      type: String
    },
    shortDesc: {
      required: [true, 'Short description is required'],
      type: String
    }
  })
);
