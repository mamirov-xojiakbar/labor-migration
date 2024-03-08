const { Router } = require("express");
const {
  addApplication,
  getAllApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
} = require("../controllers/application.controller");

const router = Router();

router.post("/", addApplication);
router.get("/", getAllApplication);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

module.exports = router;
