const { Router } = require("express");

const adminRoute = require("./admin.routes");
const applicationRoute = require("./application.routes");
const countryRoute = require("./country.routes");
const employerRoute = require("./employer.routes");
const jobRoute = require("./job.routes");
const vacancyRoute = require("./vacancy.routes");
const workerRoute = require("./worker.routes");
const worker_jobRoute = require("./worker_job.routes");

const router = Router();

router.use("/admin", adminRoute);
router.use("/application", applicationRoute);
router.use("/country", countryRoute);
router.use("/employer", employerRoute);
router.use("/job", jobRoute);
router.use("/vacancy", vacancyRoute);
router.use("/worker", workerRoute);
router.use("/worker_job", worker_jobRoute);

module.exports = router;
