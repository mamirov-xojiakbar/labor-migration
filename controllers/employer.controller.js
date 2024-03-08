const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { employerValidation } = require("../validations/Employer");
const myJwt = require("../service/jwt_service");
const config = require("config");
const { to } = require("../helpers/to_promise");

const addEmployer = async (req, res) => {
  try {
    const { error, value } = employerValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      company_name,
      industry,
      country_id,
      address,
      location,
      contact_name,
      contact_passport,
      contact_email,
      contact_phone,
      hashed_password,
      hashed_refresh_token,
    } = value;

    const verifyCountry = await pool.query(
      `SELECT * FROM country WHERE id = $1`,
      [country_id]
    );

    if (verifyCountry.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Country with this ID does not exist!" });
    }

    const uniqueEmail = await pool.query(
      `
        SELECT * FROM employer WHERE contact_email = $1
      `,
      [contact_email]
    );

    if (uniqueEmail.rows.length != 0) {
      return res
        .status(400)
        .send({ message: "Bu email orqali royxatdan otilgan" });
    }

    const hashedPassword = bcrypt.hashSync(hashed_password, 7);

    const newEmployer = await pool.query(
      `
      INSERT INTO employer (company_name, industry, country_id, address, location, contact_name, contact_passport, contact_email, contact_phone, hashed_password, hashed_refresh_token) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
      `,
      [
        company_name,
        industry,
        country_id,
        address,
        location,
        contact_name,
        contact_passport,
        contact_email,
        contact_phone,
        hashedPassword,
        hashed_refresh_token,
      ]
    );
    res.status(201).send(newEmployer.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getAllEmployer = async (req, res) => {
  try {
    const getEmployer = await pool.query(
      `
        SELECT * FROM employer
      `
    );
    res.status(200).send(getEmployer.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getEmployerById = async (req, res) => {
  try {
    const { id } = req.params;
    const getEmployer = await pool.query(
      `
        SELECT * FROM employer WHERE id = $1
      `,
      [id]
    );
    if (getEmployer.rows.length == 0) {
      return res.status(404).send({
        message: "Employer not found",
      });
    }
    res.status(200).send(getEmployer.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const updateEmployer = async (req, res) => {
  try {
    const { error, value } = employerValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      company_name,
      industry,
      country_id,
      address,
      location,
      contact_name,
      contact_passport,
      contact_email,
      contact_phone,
      hashed_password,
      hashed_refresh_token,
    } = value;
    const { id } = req.params;

    const verifyCountry = await pool.query(
      `SELECT * FROM country WHERE id = $1`,
      [country_id]
    );

    if (verifyCountry.rows.length === 0) {
      return res
        .status(400)
        .send({ message: "Country with this ID does not exist!" });
    }

    const uniqueEmail = await pool.query(
      `
        SELECT * FROM employer WHERE contact_email = $1
      `,
      [contact_email]
    );

    if (uniqueEmail.rows.length != 0) {
      return res
        .status(400)
        .send({ message: "Bu email orqali royxatdan otilgan" });
    }

    const hashedPassword = bcrypt.hashSync(hashed_password, 7);

    const updateEmployer = await pool.query(
      `
        UPDATE employer SET company_name = $1,
        industry= $2,
        country_id = $3,
        address = $4,
        location = $5,
        contact_name = $6,
        contact_passport = $7,
        contact_email = $8,
        contact_phone = $9,
        hashed_password = $10,
        hashed_refresh_token = $11
        WHERE id = $12 RETURNING *
      `,
      [
        company_name,
        industry,
        country_id,
        address,
        location,
        contact_name,
        contact_passport,
        contact_email,
        contact_phone,
        hashedPassword,
        hashed_refresh_token,
        id,
      ]
    );
    if (updateEmployer.rows.length == 0) {
      return res.status(404).send({
        message: "Employer not found",
      });
    }
    res
      .status(200)
      .send({ message: "Updated", updateEmployer: updateEmployer.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const deleteEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEmployer = await pool.query(
      `
        DELETE FROM employer WHERE id = $1 RETURNING *
      `,
      [id]
    );
    if (deleteEmployer.rows.length == 0) {
      return res.status(404).send({
        message: "Employer not found",
      });
    }
    res
      .status(200)
      .send({ message: "Deleted", deleteEmployer: deleteEmployer.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const loginEmployer = async (req, res) => {
  try {
    const { contact_email, hashed_password } = req.body;
    const employer = await pool.query(
      "SELECT * FROM employer WHERE contact_email = $1",
      [contact_email]
    );

    if (!employer.rows.length) {
      return res
        .status(400)
        .send({ message: "error in contact_email or password" });
    }

    const validPassword = bcrypt.compareSync(
      hashed_password,
      employer.rows[0].hashed_password
    );

    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "error in contact_email or password" });
    }

    const payload = {
      id: employer.rows[0].id,
    };

    const tokens = myJwt.generateTokens(payload);
    console.log(tokens);

    await pool.query(
      "UPDATE employer SET hashed_refresh_token = $1 WHERE id = $2",
      [tokens.refreshToken, employer.rows[0].id]
    );

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.status(200).send(tokens);
  } catch (error) {
    console.log(error);
    res.status(500).send({ Error: "Serverda xatolik", error });
  }
};

const logoutEmployer = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (refreshToken) {
      const queryText =
        "UPDATE employer SET hashed_refresh_token = $1 WHERE hashed_refresh_token = $2 RETURNING *";
      const values = ["", refreshToken];

      const result = await pool.query(queryText, values);

      if (result.rows.length === 0)
        return res.status(400).send({ message: "The Employer is not found" });

      res.clearCookie("refreshToken", { httpOnly: true });
      return res.send({ message: "LOGOUT", employer: result.rows[0] });
    }
    return res
      .status(400)
      .send({ message: "There is no refresh tokens in cookie" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

const refreshEmployerToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie da refresh topilmadi" });
    }

    const [error, employerDataFromCookie] = await to(
      myJwt.verifyRefreshToken(refreshToken)
    );

    if (error) {
      return res.status(403).send({ message: error.message });
    }

    const employerDataFromDB = await pool.query(
      `
      SELECT * FROM employer WHERE hashed_refresh_token = $1
    `,
      [refreshToken]
    );

    if (employerDataFromDB.rows.length === 0) {
      return res.status(403).send({ message: "Ruxsat etilmagan (Avtor yoq)" });
    }

    const payload = {
      id: employerDataFromDB.rows[0].id,
    };

    const tokens = myJwt.generateTokens(payload);

    await pool.query(
      "UPDATE employer SET hashed_refresh_token = $1 WHERE id = $2",
      [tokens.refreshToken, employerDataFromDB.rows[0].id]
    );

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.status(200).send(tokens);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  addEmployer,
  getAllEmployer,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
  loginEmployer,
  logoutEmployer,
  refreshEmployerToken,
};
