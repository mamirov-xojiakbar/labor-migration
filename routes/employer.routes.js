const { Router } = require("express");
const {
  addEmployer,
  getAllEmployer,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
  loginEmployer,
  logoutEmployer,
  refreshEmployerToken,
} = require("../controllers/employer.controller");

const router = Router();

router.post("/", addEmployer);
router.post("/login", loginEmployer);
router.post("/logout", logoutEmployer);
router.post("/refreshToken", refreshEmployerToken);
router.get("/", getAllEmployer);
router.get("/:id", getEmployerById);
router.put("/:id", updateEmployer);
router.delete("/:id", deleteEmployer);

module.exports = router;
