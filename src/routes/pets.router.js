const { mongoose } = require("mongoose");
const { Router } = require("express");
const router = Router();

const protectionMiddleware = require("../middlewares/protection.middleware");
const Pet = require("../models/Pet.model");
const { handleNotFound } = require("../utils");

router.use(protectionMiddleware);

/* GET Pets listing. */
router.get("/pets", async (req, res, next) => {
  try {
    if (req.user) {
      const allPets = await Pet.find();
      res.json(allPets);
    }
  } catch (error) {
    next(error);
  }
});

/* POST Pet */
router.post("/pets", async (req, res, next) => {
  try {
    const { name, photoPet, kindAnimal, breed, age, gender, healthStatus } =
      req.body;

    const createdAnnoncePet = await Pet.create({
      name,
      photoPet,
      kindAnimal,
      breed,
      age,
      gender,
      healthStatus,
      user: req.user.id,
    });
    res.json(createdAnnoncePet);
  } catch (error) {
    next(error);
  }
});

/*GET 1 Pet */
router.get("/pets/:petsId", async (req, res, next) => {
  const { petId } = req.params;

  try {
    const pet = await Pet.findById(petId);

    if (!pet) {
      handleNotFound(res);
      return;
    }
    res.json(pet);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
