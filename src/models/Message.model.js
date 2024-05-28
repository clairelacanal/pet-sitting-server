const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    message: {
      type: String,
      maxLength: 1000,
    },
    AuthorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    AnnonceId: {
      type: Schema.Types.ObjectId,
      ref: "Announce",
    },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);
module.exports = Message;