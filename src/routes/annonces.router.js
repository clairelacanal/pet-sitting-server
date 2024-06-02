const { mongoose } = require("mongoose");
const { Router } = require("express");
const router = Router();

const protectionMiddleware = require("../middlewares/protection.middleware");
const Annonce = require("../models/Annonce.model");
const Pet = require("../models/Pet.model");
const { handleNotFound } = require("../utils");

router.use(protectionMiddleware);

/* GET Annonces listing with optional city filtering */
router.get("/", async (req, res, next) => {
  const { city } = req.query; // Récupérer le paramètre de requête city

  try {
    let query = {};
    if (city) {
      // Si un paramètre city est fourni, ajouter au critère de recherche
      query.city = new RegExp(city, "i"); // Utiliser une expression régulière pour la recherche insensible à la casse
    }

    const allAnnonces = await Annonce.find(query);
    res.json(allAnnonces);
  } catch (error) {
    next(error);
  }
});

/*GET 1 Annonce */
router.get("/:annonceId", async (req, res, next) => {
  const { annonceId } = req.params;
  if (!mongoose.isValidObjectId(annonceId)) {
    handleNotFound(res);
    return;
  }

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

// Route pour obtenir les annonces par ID utilisateur
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const annonces = await Annonce.find({ user: userId });
    if (!annonces) {
      return res
        .status(404)
        .json({ message: "Aucune annonce trouvée pour cet utilisateur" });
    }
    res.status(200).json(annonces);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des annonces", error });
  }
});

/* POST Annonce */
router.post("/", async (req, res, next) => {
  try {
    const { kind, photo, city, description, startDate, endDate, petId } =
      req.body;

    //faire un check pour vérifier que l'animal appartient à la personne
    const pet =
      kind === "Owner"
        ? await Pet.findOne({ _id: petId, owner: req.user.id })
        : null;
    if (kind === "Owner" && !pet) {
      return res.status(404).json({ message: "L'animal n'a pas été trouvé" });
    }

    const createdAnnonce = await Annonce.create({
      kind,
      photo,
      city,
      description,
      startDate,
      endDate,
      pet: pet?.id,
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
  const { kind, photo, city, description, startDate, endDate } = req.body;
  try {
    const modifiedAnnonce = await Annonce.findByIdAndUpdate(
      annonceId,
      {
        kind,
        photo,
        city,
        description,
        startDate,
        endDate,
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
