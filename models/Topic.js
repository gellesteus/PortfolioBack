import mongoose from "mongoose";

export default mongoose.model(
  "topic",
  new mongoose.Schema({
    title: {
      type: String,
      required: [true, "A title is required"]
    },
    body: {
      /* Will reference a post that is to be displayed as the body of the first post of the topic */
      type: mongoose.Schema.ObjectId,
      required: [true, "A body is required"]
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
