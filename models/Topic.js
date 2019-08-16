import mongoose from "mongoose";

export default mongoose.model(
  "topic",
  new mongoose.Schema({
    title: {
      type: String,
      required: [true, "A title is required"]
    },
    body: {
      type: mongoose.Schema.ObjectId
    },
    category: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A topic must belong to a category"]
    },
    posts: {
      type: [mongoose.Schema.ObjectId]
    }
  })
);
