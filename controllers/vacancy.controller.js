const pool = require("../config/db");
const { vacancyValidation } = require("../validations/Vacancy");

const addVacancy = async (req, res) => {
  try {
    const { error, value } = vacancyValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      employer_id,
      city,
      job_id,
      salary,
      description,
      requirements,
      internship,
      job_type,
      work_hour,
      medicine,
      housing,
      gender,
      age_limit,
      graduate,
      exprience,
      trial_period,
    } = value;

    const verifyEmployer = await pool.query(
      `SELECT * FROM employer WHERE id = $1`,
      [employer_id]
    );

    if (verifyEmployer.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Employer with this ID does not exist!" });
    }

    const verifyJob = await pool.query(`SELECT * FROM job WHERE id = $1`, [
      job_id,
    ]);

    if (verifyJob.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Job with this ID does not exist!" });
    }

    const newVacancy = await pool.query(
      `
      INSERT INTO vacancy (employer_id,
      city,
      job_id,
      salary,
      description,
      requirements,
      internship,
      job_type,
      work_hour,
      medicine,
      housing,
      gender,
      age_limit,
      graduate,
      exprience,
      trial_period) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *
      `,
      [
        employer_id,
        city,
        job_id,
        salary,
        description,
        requirements,
        internship,
        job_type,
        work_hour,
        medicine,
        housing,
        gender,
        age_limit,
        graduate,
        exprience,
        trial_period,
      ]
    );
    res.status(201).send(newVacancy.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getAllVacancy = async (req, res) => {
  try {
    const getVacancy = await pool.query(
      `
        SELECT * FROM vacancy
      `
    );
    res.status(200).send(getVacancy.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getVacancyById = async (req, res) => {
  try {
    const { id } = req.params;
    const getVacancy = await pool.query(
      `
        SELECT * FROM vacancy WHERE id = $1
      `,
      [id]
    );
    if (getVacancy.rows.length == 0) {
      return res.status(404).send({
        message: "Vacancy not found",
      });
    }
    res.status(200).send(getVacancy.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const updateVacancy = async (req, res) => {
  try {
    const { error, value } = vacancyValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      employer_id,
      city,
      job_id,
      salary,
      description,
      requirements,
      internship,
      job_type,
      work_hour,
      medicine,
      housing,
      gender,
      age_limit,
      graduate,
      exprience,
      trial_period,
    } = value;
    const { id } = req.params;

    const verifyEmployer = await pool.query(
      `SELECT * FROM employer WHERE id = $1`,
      [employer_id]
    );

    if (verifyEmployer.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Employer with this ID does not exist!" });
    }

    const verifyJob = await pool.query(`SELECT * FROM job WHERE id = $1`, [
      job_id,
    ]);

    if (verifyJob.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Job with this ID does not exist!" });
    }

    const updateVacancy = await pool.query(
      `
        UPDATE vacancy SET employer_id = $1,
      city = $2,
      job_id = $3,
      salary = $4,
      description = $5,
      requirements = $6,
      internship = $7,
      job_type = $8,
      work_hour = $9,
      medicine = $10,
      housing = $11,
      gender = $12,
      age_limit = $13,
      graduate = $14,
      exprience = $15,
      trial_period = $16
        WHERE id = $17 RETURNING *
      `,
      [
        employer_id,
        city,
        job_id,
        salary,
        description,
        requirements,
        internship,
        job_type,
        work_hour,
        medicine,
        housing,
        gender,
        age_limit,
        graduate,
        exprience,
        trial_period,
        id,
      ]
    );
    if (updateVacancy.rows.length == 0) {
      return res.status(404).send({
        message: "Vacancy not found",
      });
    }
    res
      .status(200)
      .send({ message: "Updated", updateVacancy: updateVacancy.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const deleteVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteVacancy = await pool.query(
      `
        DELETE FROM vacancy WHERE id = $1 RETURNING *
      `,
      [id]
    );
    if (deleteVacancy.rows.length == 0) {
      return res.status(404).send({
        message: "Vacancy not found",
      });
    }
    res
      .status(200)
      .send({ message: "Deleted", deleteVacancy: deleteVacancy.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

module.exports = {
  addVacancy,
  getAllVacancy,
  getVacancyById,
  updateVacancy,
  deleteVacancy,
};
