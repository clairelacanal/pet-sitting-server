const { Schema, model } = require("mongoose");

const petSchema = new Schema({
  photoPet: String,
  name: {
    type: String,
    required: [true, "Le nom est obligatoire"],
  },
  kindAnimal: {
    type: String,
    enum: ["chien", "chat", "reptile", "oiseau", "rongeur"],
    required: [true, "Le type d'animal est requis"],
  },
  breed: {
    type: String,
    required: [true, "La race d'animal est requise"],
  },
  age: {
    type: Number,
    min: 0,
    required: [true, "L'âge de l'animal est obligatoire"],
  },
  gender: {
    type: String,
    enum: ["Male", "Femelle"],
    required: [true, "Le genre est obligatoire"],
  },
  healthStatus: {
    type: String,
    enum: ["sain", "en rétablissement", "malade"],
    required: [true, "Le statut de santé est obligatoire"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Pet = model("Pet", petSchema);

module.exports = Pet;
