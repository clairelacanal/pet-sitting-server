const { mongoose } = require("mongoose");
const { Router } = require("express");
const router = Router();

const protectionMiddleware = require("../middlewares/protection.middleware");
const Comment = require("../models/Comment.model");
const { handleNotFound } = require("../utils");

router.use(protectionMiddleware);

/* GET Comments listing. */
router.get("/pets/:petId/comments", async (req, res, next) => {
  const { petId } = req.params;
  try {
    const allComments = await Comment.find({ pet: petId });
    res.json(allComments);
  } catch (error) {
    next(error);
  }
});

/* POST Comment */
router.post("/pets/:petId/comments", async (req, res, next) => {
  try {
    const { comment, rate } = req.body;
    const { petId } = req.params;

    const createdComment = await Comment.create({
      comment,
      rate,
      author: req.user.id,
      pet: petId,
    });
    res.json(createdComment);
  } catch (error) {
    next(error);
  }
});

/* PUT Comment */
router.put("/comments/:commentId", async (req, res, next) => {
  const { commentId } = req.params;
  const { comment, rate } = req.body;
  try {
    const modifiedComment = await Comment.findOneAndUpdate(
      { _id: commentId, author: req.user.id },
      {
        comment,
        rate,
      },
      {
        new: true,
      }
    );
    if (!modifiedComment) {
      handleNotFound(res);
      return;
    }
    res.json(modifiedComment);
  } catch (error) {
    next(error);
  }
});

/* DELETE Comment */
router.delete("/comments/:commentId", async (req, res, next) => {
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
    handleNotFound(res);
    return;
  }

  try {
    await Comment.findByIdAndDelete({ _id: commentId, author: req.user.id });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
