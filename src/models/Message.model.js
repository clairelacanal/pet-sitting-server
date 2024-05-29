const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    message: {
      type: String,
      maxLength: 1000,
    },
    //la personne qui a fait l'annonce ET qui repond
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    announce: {
      type: Schema.Types.ObjectId,
      ref: "Announce",
      required: true,
    },
    //la personne qui a fait l'annonce ET qui repond
    destinataire: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);
module.exports = Message;
