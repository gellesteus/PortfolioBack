import mongoose from "mongoose";

export default mongoose.model(
  "category",
  mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    desc: {
      type: String,
      required: [true, "Description is required"]
    },
    postion: {
      type: Number,
      default: 1
    },
    created_at: {
      type: String,
      default: Date.now
    },
    topics: {
      type: [String],
      default: []
    }
  })
);
