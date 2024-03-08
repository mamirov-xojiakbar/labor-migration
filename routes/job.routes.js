const { Router } = require("express");
const {
  addJob,
  getAllJob,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/job.controller");

const router = Router();

router.post("/", addJob);
router.get("/", getAllJob);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
