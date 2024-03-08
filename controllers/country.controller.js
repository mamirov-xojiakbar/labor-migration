const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { countryValidation } = require("../validations/Country");

const addCountry = async (req, res) => {
  try {
    const { error, value } = countryValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { name, flag } = value;

    const newCountry = await pool.query(
      `
      INSERT INTO country (name, flag) 
      VALUES ($1, $2) RETURNING *
      `,
      [name, flag]
    );
    res.send({ message: "Added", newCountry: newCountry.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getAllCountry = async (req, res) => {
  try {
    const getCountry = await pool.query(
      `
        SELECT * FROM country
      `
    );
    res.status(200).send(getCountry.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const getCountry = await pool.query(
      `
        SELECT * FROM country WHERE id = $1
      `,
      [id]
    );
    if (getCountry.rows.length == 0) {
      return res.status(404).send({
        message: "Country not found",
      });
    }
    res.status(200).send(getCountry.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const updateCountry = async (req, res) => {
  try {
    const { error, value } = countryValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { name, flag } = value;
    const { id } = req.params;

    const updateCountry = await pool.query(
      `
        UPDATE country SET name = $1, flag = $2
        WHERE id = $3 RETURNING *
      `,
      [name, flag, id]
    );
    if (updateCountry.rows.length == 0) {
      return res.status(404).send({
        message: "Country not found",
      });
    }
    res
      .status(200)
      .send({ message: "Updated", updateCountry: updateCountry.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCountry = await pool.query(
      `
        DELETE FROM country WHERE id = $1 RETURNING *
      `,
      [id]
    );
    if (deleteCountry.rows.length == 0) {
      return res.status(404).send({
        message: "Country not found",
      });
    }
    res
      .status(200)
      .send({ message: "Deleted", deleteCountry: deleteCountry.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

module.exports = {
  addCountry,
  getAllCountry,
  getCountryById,
  updateCountry,
  deleteCountry,
};
