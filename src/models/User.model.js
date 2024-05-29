const { Schema, model } = require("mongoose");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//"Le mot de passe doit contenir au moins 8 caractères, inclure des lettres majuscules, des lettres minuscules, un chiffre et un caractère spécial",

const userSchema = new Schema(
  {
    photoUser: String,
    userName: {
      type: String,
      required: [true, "Votre pseudo est obligatoire"],
      unique: [true, "Le pseudo est déjà utilisé"],
    },
    email: {
      type: String,
      required: [true, "Votre mail est obligatoire"],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
module.exports = User;
