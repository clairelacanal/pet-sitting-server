var express = require("express");
var router = express.Router();
const Announce = require("../models/Announce.model");

/* GET Annonces listing. */
router.get("/", function (req, res, next) {
  try {
  } catch (error) {}
});

/* POST Annonce */
router.post("/", async (req, res, next) => {
  const { kind, description, date } = req.body;

  const createdAnnounce = await Announce.create({
    kind,
    description,
    date,
    pet: req.pet.id,
    user: req.user.id,
  });
  try {
  } catch (error) {}
});

/* PUT Annonce */
router.put("/", function (req, res, next) {
  try {
  } catch (error) {}
});

/* DELETE Annonce */
router.delete("/", function (req, res, next) {
  try {
  } catch (error) {}
});

module.exports = router;
