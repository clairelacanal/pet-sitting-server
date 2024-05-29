const { mongoose } = require("mongoose");
const { Router } = require("express");
const router = Router();

const protectionMiddleware = require("../middlewares/protection.middleware");
const Comment = require("../models/Comment.model");
const { handleNotFound } = require("../utils");

router.use(protectionMiddleware);

/* GET Comments listing. */
router.get("/:announceId", async (req, res, next) => {
  try {
    if (req.user) {
      const allComments = await Comment.find();
      res.json(allComments);
    }
  } catch (error) {
    next(error);
  }
});

/* POST Comment */
router.post("/my-favorites/petId", async (req, res, next) => {
  try {
    const { kind, description, date } = req.body;

    const createdAnnounce = await Announce.create({
      kind,
      description,
      date,
      pet: req.pet.id,
      user: req.user.id,
    });
    res.json(createdAnnounce);
  } catch (error) {
    next(error);
  }
});
