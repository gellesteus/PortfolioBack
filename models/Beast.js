import mongoose from "mongoose";

export default mongoose.model(
  "beast",
  mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    shortDesc: {
      type: String,
      required: [true, "Short description is required"]
    },
    longDesc: {
      type: String,
      required: [true, "Long description is required"]
    },
    images: {
      type: [String]
    }
  })
);
