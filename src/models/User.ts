import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  created_at: {
    default: Date.now,
    type: Date
  },
  email: {
    required: [true, 'Email is required'],
    type: String
  },
  file_count: {
    default: 0,
    type: Number
  },
  files: {
    default: [],
    type: [String]
  },
  last_online: {
    default: Date.now,
    type: Date
  },
  must_change_password: {
    default: false,
    type: Boolean
  },
  password: {
    required: [true, 'Password is required'],
    type: String
  },
  role: {
    default: 'user',
    type: String
  },
  session_token: {
    default: null,
    type: String
  },
  username: {
    required: [true, 'Username is required'],
    type: String
  },
  validated: {
    default: false,
    type: Boolean
  }
});

export interface IUser extends mongoose.Document {
  created_at: Date;
  email: string;
  file_count: number;
  files: string[];
  last_online: Date;
  must_change_password: boolean;
  password: string;
  role: string;
  session_token: string | null;
  username: string;
  validated: boolean;
}

schema.pre('validate', function(next: (e?: Error) => void): void {
  const self: IUser = this as IUser;
  User.findOne({ email: self.email, _id: { $ne: self._id } }).then(user => {
    if (user) {
      next(new Error('Email is already in use'));
    } else {
      next();
    }
  });
});

schema.pre('validate', function(next: (e?: Error) => void): void {
  const self: IUser = this as IUser;

  User.findOne({ username: self.username, _id: { $ne: self._id } }).then(
    user => {
      if (user) {
        if (user._id === self._id) {
          /* Only found this model */
          next();
        } else {
          next(new Error('Username is already in use'));
        }
      } else {
        next();
      }
    }
  );
});

const User = mongoose.model<IUser>('user', schema);

export default User;
