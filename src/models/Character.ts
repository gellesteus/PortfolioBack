import mongoose from 'mongoose';

export interface ICharacter extends mongoose.Document {
  apperance?: string | null;
  bond?: string | null;
  description?: string | null;
  flaws?: string | null;
  goal?: string | null;
  ideal?: string | null;
  known: boolean;
  mannerism?: string | null;
  name: string;
  secret: string;
}

export default mongoose.model<ICharacter>(
  'character',
  new mongoose.Schema({
    appearance: {
      type: String
    },
    bond: {
      type: String
    },
    description: {
      type: String
    },
    flaws: {
      type: String
    },
    goal: {
      type: String
    },
    ideal: {
      type: String
    },
    known: {
      default: false,
      required: [true, 'Known status is required'],
      type: Boolean
    },
    mannerism: {
      type: String
    },
    name: {
      required: [true, 'Name is required'],
      type: String
    },
    secret: {
      type: String
    }
  })
);
