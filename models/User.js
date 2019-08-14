import mongoose from "mongoose";

export default mongoose.model(
  "user",
  new mongoose.Schema({
    username: {
      type: String,
      required: [true, "Username is required"]
    },
    created: {
      type: Date,
      required: [true, "Created date is required"],
      default: Date.now
    },
    lastOnline: {
      type: Date
    },
    sessionToken: {
      type: String
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
    }
  })
);
