const { mongoose } = require("mongoose");
const { Router } = require("express");
const router = Router();

const protectionMiddleware = require("../middlewares/protection.middleware");
const Announce = require("../models/Announce.model");
const { handleNotFound } = require("../utils");

router.use(protectionMiddleware);

/* GET Annonces listing. */
router.get("/", async (req, res, next) => {
  try {
    const allAnnounces = await Announce.find();
    res.json(allAnnounces);
  } catch (error) {
    next(error);
  }
});

/*GET 1 Annonce */
router.get("/:announceId", async (req, res, next) => {
  const { announceId } = req.params;

  try {
    const announce = await Announce.findById(announceId);

    if (!announce) {
      handleNotFound(res);
      return;
    }
    res.json(announce);
  } catch (error) {
    next(error);
  }
});

/* POST Annonce */
router.post("/", async (req, res, next) => {
  try {
    const { kind, description, date, petId } = req.body;
    //faire un check pour vérifier que l'animal appartient à la personne

    const createdAnnounce = await Announce.create({
      kind,
      description,
      date,
      pet: petId,
      user: req.user.id,
    });
    res.json(createdAnnounce);
  } catch (error) {
    next(error);
  }
});

/* PUT Annonce */
router.put("/:announceId", async (req, res, next) => {
  const { announceId } = req.params;
  const { kind, description, date } = req.body;
  try {
    const modifiedAnnounce = await Announce.findByIdAndUpdate(
      announceId,
      {
        kind,
        description,
        date,
      },
      {
        new: true,
      }
    );
    if (!modifiedAnnounce) {
      handleNotFound(res);
      return;
    }
    res.json(modifiedAnnounce);
  } catch (error) {
    next(error);
  }
});

/* DELETE Annonce */
router.delete("/:announceId", async (req, res, next) => {
  const { announceId } = req.params;

  if (!mongoose.isValidObjectId(announceId)) {
    handleNotFound(res);
    return;
  }

  try {
    if (req.user) {
      await Announce.findByIdAndDelete({ _id: announceId, user: req.user.id });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
