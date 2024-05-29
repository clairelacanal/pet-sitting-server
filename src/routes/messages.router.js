const { mongoose } = require("mongoose");
const { Router } = require("express");
const router = Router();

const protectionMiddleware = require("../middlewares/protection.middleware");
const Message = require("../models/Message.model");
const { handleNotFound } = require("../utils");

router.use(protectionMiddleware);

/* GET Messages listing. */
router.get("/:messageId", async (req, res, next) => {
  const { messageId } = req.params;
  try {
    const message = await Message.findById(messageId);
    if (message) {
      res.json(message);
    } else {
      res.status(404).send("Message not found");
    }
  } catch (error) {
    next(error);
  }
});

/* POST Message */
router.post("/", async (req, res, next) => {
  try {
    const { message, announceId, destinataireId } = req.body;

    const createdMessage = await Message.create({
      message,
      author: req.user.id,
      announce: announceId,
      destinataire: destinataireId,
    });
    res.json(createdMessage);
  } catch (error) {
    next(error);
  }
});

/* PUT Message */
router.put("/messages/:messageId", async (req, res, next) => {
  const { messageId } = req.params;
  const { message } = req.body;
  try {
    const modifiedMessage = await Message.findOneAndUpdate(
      { _id: messageId, author: req.user.id },
      {
        message,
      },
      {
        new: true,
      }
    );
    if (!modifiedMessage) {
      handleNotFound(res);
      return;
    }
    res.json(modifiedMessage);
  } catch (error) {
    next(error);
  }
});

/* DELETE Comment */
router.delete("/messages/:messageId", async (req, res, next) => {
  const { messageId } = req.params;

  if (!mongoose.isValidObjectId(messageId)) {
    handleNotFound(res);
    return;
  }

  try {
    await Message.findByIdAndDelete({
      _id: messageId,
      author: req.user.id,
    });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
