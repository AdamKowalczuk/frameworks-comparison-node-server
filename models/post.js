const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    creator: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      imageUrl: {
        type: String,
      },
      userName: {
        type: String,
        required: true,
      },
    },
    caption: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
    location: {
      type: String,
    },
    tags: {
      type: [String],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
