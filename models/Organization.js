import mongoose from "mongoose";

export default mongoose.model(
  "organization",
  mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    members: {
      type: [String],
      default: []
    },
    known: {
      type: Boolean,
      default: false,
      select: false
    },
    holdings: {
      type: [String],
      default: []
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
