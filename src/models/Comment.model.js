const { Schema, model } = require("mongoose");
//ne pas oublier de checker si j'ai l'un ou l'autre - a ecrire dans la route

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      maxLength: 500,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;
