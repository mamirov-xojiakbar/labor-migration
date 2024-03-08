const { Router } = require("express");
const {
  addAdmin,
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} = require("../controllers/admin.controller");

const adminPolice = require("../middleware/admin_police");
const creatorPolice = require("../middleware/creator_police");

const router = Router();

router.post("/", creatorPolice, addAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refreshToken", refreshAdminToken);
router.get("/", adminPolice, getAllAdmin);
router.get("/:id", adminPolice, getAdminById);
router.put("/:id", creatorPolice, updateAdmin);
router.delete("/:id", creatorPolice, deleteAdmin);

module.exports = router;
