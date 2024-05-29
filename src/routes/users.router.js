const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { TOKEN_SECRET, passwordRegex } = require("../consts");
const protectionMiddleware = require("../middlewares/protection.middleware");
const User = require("../models/User.model");

router.post("/signup", async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (!password?.test(passwordRegex)) {
    res.status(400).json({
      message:
        "Le mot de passe doit contenir au moins 8 caractères, inclure des lettres majuscules, des lettres minuscules, un chiffre et un caractère spécial",
    });
    return;
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const createdUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    delete createdUser._doc.password; // 👈 remove password from response

    res.status(201).json(createdUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });

    const isCorrectCredentials =
      user != null && (await bcrypt.compare(password, user.password));

    if (!isCorrectCredentials) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const authToken = jwt.sign({ userName }, TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    res.json({ authToken });
  } catch (err) {
    next(err);
  }
});

router.use(protectionMiddleware); // 👇 all routes bellow are now protected

router.get("/my-profile", (req, res, next) => {
  // `user` was stored in `req` in the `protectionMiddleware`
  res.json(req.user);
});

module.exports = router;
