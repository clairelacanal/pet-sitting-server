const { mongoose } = require("mongoose");
const { Router } = require("express");
const router = Router();

const protectionMiddleware = require("../middlewares/protection.middleware");
const Annonce = require("../models/Annonce.model");
const Pet = require("../models/Pet.model");
const { handleNotFound } = require("../utils");

router.use(protectionMiddleware);

/* GET Annonces listing. */
router.get("/", async (req, res, next) => {
  try {
    const allAnnonces = await Annonce.find();
    res.json(allAnnonces);
  } catch (error) {
    next(error);
  }
});

/*GET 1 Annonce */
router.get("/:annonceId", async (req, res, next) => {
  const { annonceId } = req.params;

  try {
    const annonce = await Annonce.findById(annonceId);

    if (!annonce) {
      handleNotFound(res);
      return;
    }
    res.json(annonce);
  } catch (error) {
    next(error);
  }
});

/* POST Annonce */
router.post("/", async (req, res, next) => {
  try {
    const { kind, description, date, petId } = req.body;
    //faire un check pour vérifier que l'animal appartient à la personne
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).send("L'animal n'a pas été trouvé");
    }
    if (pet.req.user.id.toString() !== req.user.id.toString()) {
      return res.status(403).send("L'animal n'appartient pas à l'utilisateur");
    }

    const createdAnnonce = await Annonce.create({
      kind,
      description,
      date,
      pet: petId,
      user: req.user.id,
    });
    res.json(createdAnnonce);
  } catch (error) {
    next(error);
  }
});

/* PUT Annonce */
router.put("/:annonceId", async (req, res, next) => {
  const { annonceId } = req.params;
  const { kind, description, date } = req.body;
  try {
    const modifiedAnnonce = await Annonce.findByIdAndUpdate(
      annonceId,
      {
        kind,
        description,
        date,
      },
      {
        new: true,
      }
    );
    if (!modifiedAnnonce) {
      handleNotFound(res);
      return;
    }
    res.json(modifiedAnnonce);
  } catch (error) {
    next(error);
  }
});

/* DELETE Annonce */
router.delete("/:annonceId", async (req, res, next) => {
  const { annonceId } = req.params;

  if (!mongoose.isValidObjectId(annonceId)) {
    handleNotFound(res);
    return;
  }

  try {
    if (req.user) {
      await Annonce.findByIdAndDelete({ _id: annonceId, user: req.user.id });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;