const { mongoose } = require("mongoose");
const { Router } = require("express");
const router = Router();

const protectionMiddleware = require("../middlewares/protection.middleware");
const Annonce = require("../models/Annonce.model");
const Pet = require("../models/Pet.model");
const { handleNotFound } = require("../utils");

router.use(protectionMiddleware);

/* GET Annonces avec filtre sur la ville et sur les autres filtres */
router.get("/annonces", async (req, res, next) => {
  const { city, kindAnimal, ageCategory, gender, healthStatus } = req.query; // Récupérer les paramètres de requête

  try {
    let query = {};
    if (city) {
      // Si un paramètre city est fourni, l'ajouter au critère de recherche
      query.city = new RegExp(city, "i"); // Utiliser une expression régulière pour une recherche insensible à la casse
    }
    if (kindAnimal) {
      // Si un paramètre kind est fourni, l'ajouter au critère de recherche
      query.kindAnimal = kindAnimal;
    }
    if (gender) {
      // Si un paramètre gender est fourni, l'ajouter au critère de recherche
      query.gender = gender;
    }
    if (healthStatus) {
      // Si un paramètre healthStatus est fourni, l'ajouter au critère de recherche
      query.healthStatus = healthStatus;
    }
    if (ageCategory) {
      // Gérer la catégorie d'âge en fonction de la valeur spécifiée
      query.age = ageCategory === "older" ? { $gt: 5 } : { $lte: 5 };
    }

    const allAnnonces = await Annonce.find(query).populate("pet");
    res.json(allAnnonces);
  } catch (error) {
    next(error); // Passer à la gestion des erreurs middleware si une exception est levée
  }
});

/*GET 1 Annonce */
router.get("/annonces/:annonceId", async (req, res, next) => {
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
router.get("/annonces/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const annonces = await Annonce.find({ user: userId });
    if (!annonces) {
      handleNotFound(res);
      return;
    }
    res.json(annonces);
  } catch (error) {
    next(error);
  }
});

/* POST Annonce */
router.post("/annonces", async (req, res, next) => {
  try {
    const { kind, city, description, startDate, endDate, petId } = req.body;
    console.log(petId);

    //faire un check pour vérifier que l'animal appartient à la personne
    const pet =
      kind === "Owner"
        ? await Pet.findOne({ _id: petId, user: req.user.id })
        : null;
    if (kind === "Owner" && !pet) {
      return res.status(404).json({ message: "L'animal n'a pas été trouvé" });
    }

    const createdAnnonce = await Annonce.create({
      kind,
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
router.put("/annonces/:annonceId", async (req, res, next) => {
  const { annonceId } = req.params;
  const { kind, city, description, startDate, endDate } = req.body;
  try {
    const modifiedAnnonce = await Annonce.findByIdAndUpdate(
      annonceId,
      {
        kind,
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
router.delete("/annonces/:annonceId", async (req, res, next) => {
  const { annonceId } = req.params;

  if (!mongoose.isValidObjectId(annonceId)) {
    handleNotFound(res);
    return;
  }

  try {
    if (req.user) {
      await Annonce.findOneAndDelete({ _id: annonceId, user: req.user.id });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.get("/users/my-profile/annonces", async (req, res, next) => {
  try {
    const annonceUser = await Annonce.find({ user: req.user.id }).populate(
      "pet"
    );
    res.json(annonceUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
