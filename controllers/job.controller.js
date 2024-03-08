const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { jobValidation } = require("../validations/Job");

const addJob = async (req, res) => {
  try {
    const { error, value } = jobValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const { name, description, icon } = value;

    const newJob = await pool.query(
      `
      INSERT INTO job (name, description, icon ) 
      VALUES ($1, $2, $3) RETURNING *
      `,
      [name, description, icon]
    );
    res.status(201).send(newJob.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getAllJob = async (req, res) => {
  try {
    const getJob = await pool.query(
      `
        SELECT * FROM job
      `
    );
    res.status(200).send(getJob.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const getJob = await pool.query(
      `
        SELECT * FROM job WHERE id = $1
      `,
      [id]
    );
    if (getJob.rows.length == 0) {
      return res.status(404).send({
        message: "Job not found",
      });
    }
    res.status(200).send(getJob.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const updateJob = async (req, res) => {
  try {
    const { error, value } = jobValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const { name, description, icon } = value;
    const { id } = req.params;

    const updateJob = await pool.query(
      `
        UPDATE job SET name = $1, description = $2, icon = $3
        WHERE id = $4 RETURNING *
      `,
      [name, description, icon, id]
    );
    if (updateJob.rows.length == 0) {
      return res.status(404).send({
        message: "Job not found",
      });
    }
    res.status(200).send({ message: "Updated", updateJob: updateJob.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteJob = await pool.query(
      `
        DELETE FROM job WHERE id = $1 RETURNING *
      `,
      [id]
    );
    if (deleteJob.rows.length == 0) {
      return res.status(404).send({
        message: "Job not found",
      });
    }
    res.status(200).send({ message: "Deleted", deleteJob: deleteJob.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

module.exports = {
  addJob,
  getAllJob,
  getJobById,
  updateJob,
  deleteJob,
};
