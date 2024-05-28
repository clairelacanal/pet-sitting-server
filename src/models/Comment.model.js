const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    Comment: {
      type: String,
      maxLength: 500,
    },
    Rate: {
      type: Number,
      min: 0,
      max: 5,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;
