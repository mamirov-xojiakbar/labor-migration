const pool = require("../config/db");


const addWorker_job = async (req, res) => {
  try {
    const { worker_id, job_id } = req.body;

    const verifyWorker = await pool.query(
      `SELECT * FROM worker WHERE id = $1`,
      [worker_id]
    );

    if (verifyWorker.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Worker with this ID does not exist!" });
    }

    const verifyJob = await pool.query(
      `SELECT * FROM job WHERE id = $1`,
      [job_id]
    );

    if (verifyJob.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Job with this ID does not exist!" });
    }

    const newWorker_job = await pool.query(
      `
      INSERT INTO worker_job (worker_id, job_id) 
      VALUES ($1, $2) RETURNING *
      `,
      [worker_id, job_id]
    );
    res.status(201).send(newWorker_job.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getAllWorker_job = async (req, res) => {
  try {
    const getWorker_job = await pool.query(
      `
        SELECT * FROM worker_job
      `
    );
    res.status(200).send(getWorker_job.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getWorker_jobById = async (req, res) => {
  try {
    const { id } = req.params;
    const getWorker_job = await pool.query(
      `
        SELECT * FROM worker_job WHERE id = $1
      `,
      [id]
    );
    if (getWorker_job.rows.length == 0) {
      return res.status(404).send({
        message: "Worker_job not found",
      });
    }
    res.status(200).send(getWorker_job.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const updateWorker_job = async (req, res) => {
  try {
    const { worker_id, job_id } = req.body;
    const { id } = req.params;

    const verifyWorker = await pool.query(
      `SELECT * FROM worker WHERE id = $1`,
      [worker_id]
    );

    if (verifyWorker.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Worker with this ID does not exist!" });
    }

    const verifyJob = await pool.query(`SELECT * FROM job WHERE id = $1`, [
      job_id,
    ]);

    if (verifyJob.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Job with this ID does not exist!" });
    }


    const updateWorker_job = await pool.query(
      `
        UPDATE worker_job SET worker_id = $1, job_id = $2
        WHERE id = $3 RETURNING *
      `,
      [worker_id, job_id, id]
    );
    if (updateWorker_job.rows.length == 0) {
      return res.status(404).send({
        message: "Worker_job not found",
      });
    }
    res
      .status(200)
      .send({ message: "Updated", updateWorker_job: updateWorker_job.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const deleteWorker_job = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteWorker_job = await pool.query(
      `
        DELETE FROM worker_job WHERE id = $1 RETURNING *
      `,
      [id]
    );
    if (deleteWorker_job.rows.length == 0) {
      return res.status(404).send({
        message: "Worker_job not found",
      });
    }
    res
      .status(200)
      .send({ message: "Deleted", deleteWorker_job: deleteWorker_job.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

module.exports = {
  addWorker_job,
  getAllWorker_job,
  getWorker_jobById,
  updateWorker_job,
  deleteWorker_job,
};
