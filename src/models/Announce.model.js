const { Schema, model } = require("mongoose");

const announceSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["Owner", "Sitter"],
      required: [true, "Veuillez sélectionner un des deux champs"],
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      maxLength: 1000,
    },
    date: {
      startDate: {
        type: Date,
        required: [true, "La date de début est obligatoire"],
      },
      endDate: {
        type: Date,
        required: [true, "La date de fin est obligatoire"],
      },
    },
    PetId: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
    },
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Announce = model("Announce", announceSchema);
module.exports = Announce;