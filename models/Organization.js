import mongoose from "mongoose";

export default mongoose.model(
  "organization",
  mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    member: {
      type: [String],
      default: []
    },
    known: {
      type: Boolean,
      default: false
    },
    shortDesc: {
      type: String,
      required: [true, "Short description is required"]
    },
    longDesc: {
      type: String,
      required: [true, "Long description is required"]
    }
  })
);
