const { Schema, model } = require("mongoose");

const annonceSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["Owner", "Sitter"],
      required: [true, "Veuillez sélectionner un des deux champs"],
    },
    photo: {
      type: String,
      required: [true, "Veuillez télécharger une photo"],
    },
    city: {
      type: String,
      required: [true, "La ville est obligatoire"],
      maxLength: 30,
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
    pet: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Annonce = model("Annonce", annonceSchema);
module.exports = Annonce;
