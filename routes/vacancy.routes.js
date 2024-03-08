const { Router } = require("express");
const {
  addVacancy,
  getAllVacancy,
  getVacancyById,
  updateVacancy,
  deleteVacancy,
} = require("../controllers/vacancy.controller");

const router = Router();

router.post("/", addVacancy);
router.get("/", getAllVacancy);
router.get("/:id", getVacancyById);
router.put("/:id", updateVacancy);
router.delete("/:id", deleteVacancy);

module.exports = router;
