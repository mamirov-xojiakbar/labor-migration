const { Router } = require("express");
const {
  addWorker,
  getAllWorker,
  getWorkerById,
  updateWorker,
  deleteWorker,
  workerActivate,
  loginWorker,
  logoutWorker,
  refreshWorkerToken,
} = require("../controllers/worker.controller");

const router = Router();

router.post("/", addWorker);
router.post("/login", loginWorker);
router.post("/logout", logoutWorker);
router.post("/refreshToken", refreshWorkerToken);
router.get("/", getAllWorker);
router.get("/:id", getWorkerById);
router.put("/:id", updateWorker);
router.delete("/:id", deleteWorker);
router.get("/activate/:link", workerActivate);

module.exports = router;
