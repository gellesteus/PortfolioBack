import mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"]
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastOnline: {
    type: Date,
    default: Date.now
  },
  sessionToken: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"]
  },
  mustChangePassword: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: "user"
  },
  validated: {
    type: Boolean,
    default: false
  }
});

schema.pre("validate", function(next) {
  User.findOne({ email: this.email }).then(user => {
    if (user) {
      next(new Error("Email is already in use"));
    } else {
      next();
    }
  });
});

schema.pre("validate", function(next) {
  User.findOne({ username: this.username }).then(user => {
    if (user) {
      next(new Error("Username has already been taken"));
    } else {
      next();
    }
  });
});

const User = mongoose.model("user", schema);

export default User;
