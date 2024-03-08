const pool = require("../config/db");
const { applicationValidation } = require("../validations/Application");

const addApplication = async (req, res) => {
  try {
    const { error, value } = applicationValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { vacancy_id, worker_id, application_date } = value;

    const verifyVacancy = await pool.query(
      `SELECT * FROM vacancy WHERE id = $1`,
      [vacancy_id]
    );

    if (verifyVacancy.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Vacancy with this ID does not exist!" });
    }

    const verifyWorker = await pool.query(
      `SELECT * FROM worker WHERE id = $1`,
      [worker_id]
    );

    if (verifyWorker.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Worker with this ID does not exist!" });
    }

    const newApplication = await pool.query(
      `INSERT INTO application (vacancy_id, worker_id, application_date) 
       VALUES ($1, $2, $3) RETURNING *`,
      [vacancy_id, worker_id, application_date]
    );

    res.status(201).send(newApplication.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while processing your request." });
  }
};

const getAllApplication = async (req, res) => {
  try {
    const getApplication = await pool.query(
      `
        SELECT * FROM application
      `
    );
    res.status(200).send(getApplication.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const getApplication = await pool.query(
      `
        SELECT * FROM application WHERE id = $1
      `,
      [id]
    );
    if (getApplication.rows.length == 0) {
      return res.status(404).send({
        message: "Application not found",
      });
    }
    res.status(200).send(getApplication.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { error, value } = applicationValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { vacancy_id, worker_id, application_date } = value;
    const { id } = req.params;

    const verifyVacancy = await pool.query(
      `SELECT * FROM vacancy WHERE id = $1`,
      [vacancy_id]
    );

    if (verifyVacancy.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Vacancy with this ID does not exist!" });
    }

    const verifyWorker = await pool.query(
      `SELECT * FROM worker WHERE id = $1`,
      [worker_id]
    );

    if (verifyWorker.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Worker with this ID does not exist!" });
    }

    const updateApplication = await pool.query(
      `
        UPDATE application SET vacancy_id = $1, worker_id = $2, application_date = $3
        WHERE id = $4 RETURNING *
      `,
      [vacancy_id, worker_id, application_date, id]
    );
    if (updateApplication.rows.length == 0) {
      return res.status(404).send({
        message: "Application not found",
      });
    }
    res.status(200).send({
      message: "Updated",
      updateApplication: updateApplication.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteApplication = await pool.query(
      `
        DELETE FROM application WHERE id = $1 RETURNING *
      `,
      [id]
    );
    if (deleteApplication.rows.length == 0) {
      return res.status(404).send({
        message: "Application not found",
      });
    }
    res.status(200).send({
      message: "Deleted",
      deleteApplication: deleteApplication.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

module.exports = {
  addApplication,
  getAllApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
