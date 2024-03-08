const { Router } = require("express");
const {
  addCountry,
  getAllCountry,
  getCountryById,
  updateCountry,
  deleteCountry,
} = require("../controllers/country.controller");

const adminPolice = require("../middleware/admin_police");
const router = Router();

router.post("/",adminPolice, addCountry);
router.get("/", getAllCountry);
router.get("/:id", getCountryById);
router.put("/:id", updateCountry);
router.delete("/:id", deleteCountry);

module.exports = router;
