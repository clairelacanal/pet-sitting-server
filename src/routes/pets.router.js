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

/*GET 1 Pet */
router.get("/:petsId", async (req, res, next) => {
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
