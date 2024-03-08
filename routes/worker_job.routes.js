const { Router } = require("express");
const {
  addWorker_job,
  getAllWorker_job,
  getWorker_jobById,
  updateWorker_job,
  deleteWorker_job,
} = require("../controllers/worker_job.controller");

const router = Router();

router.post("/", addWorker_job);
router.get("/", getAllWorker_job);
router.get("/:id", getWorker_jobById);
router.put("/:id", updateWorker_job);
router.delete("/:id", deleteWorker_job);

module.exports = router;
