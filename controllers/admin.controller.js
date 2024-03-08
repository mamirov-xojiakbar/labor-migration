const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { adminValidation } = require("../validations/Admin");
const myJwt = require("../service/jwt_service");
const config = require("config");
const { to } = require("../helpers/to_promise");

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      name,
      email,
      hashed_password,
      phone_number,
      tg_link,
      is_active,
      is_creator,
      hashed_refresh_token,
      description,
    } = value;

    const uniqueEmail = await pool.query(
      `
        SELECT * FROM admin WHERE email = $1
      `,
      [email]
    );

    if (uniqueEmail.rows.length != 0) {
      return res
        .status(400)
        .send({ message: "Bu email orqali royxatdan otilgan" });
    }

    const hashedPassword = bcrypt.hashSync(hashed_password, 7);

    const newAdmin = await pool.query(
      `
      INSERT INTO admin (name, email, hashed_password, phone_number, tg_link,is_active, is_creator,hashed_refresh_token, description) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
      `,
      [
        name,
        email,
        hashedPassword,
        phone_number,
        tg_link,
        is_active,
        is_creator,
        hashed_refresh_token,
        description,
      ]
    );
    res.status(201).send(newAdmin.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const getAdmin = await pool.query(
      `
        SELECT * FROM admin
      `
    );
    res.status(200).send(getAdmin.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const getAdmin = await pool.query(
      `
        SELECT * FROM admin WHERE id = $1
      `,
      [id]
    );
    if (getAdmin.rows.length == 0) {
      return res.status(404).send({
        message: "Admin not found",
      });
    }
    res.status(200).send(getAdmin.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      name,
      email,
      hashed_password,
      phone_number,
      tg_link,
      is_creator,
      description,
    } = value;
    const { id } = req.params;

    const uniqueEmail = await pool.query(
      `
        SELECT * FROM admin WHERE email = $1
      `,
      [email]
    );

    if (uniqueEmail.rows.length != 0) {
      return res
        .status(400)
        .send({ message: "Bu email orqali royxatdan otilgan" });
    }

    const hashedPassword = bcrypt.hashSync(hashed_password, 7);

    const updateAdmin = await pool.query(
      `
        UPDATE admin SET name = $1, email = $2, hashed_password = $3, phone_number = $4, tg_link = $5, is_creator = $6, description = $7
        WHERE id = $8 RETURNING *
      `,
      [
        name,
        email,
        hashedPassword,
        phone_number,
        tg_link,
        is_creator,
        description,
        id,
      ]
    );
    if (updateAdmin.rows.length == 0) {
      return res.status(404).send({
        message: "Admin not found",
      });
    }
    res
      .status(200)
      .send({ message: "Updated", updateAdmin: updateAdmin.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteAdmin = await pool.query(
      `
        DELETE FROM admin WHERE id = $1 RETURNING *
      `,
      [id]
    );
    if (deleteAdmin.rows.length == 0) {
      return res.status(404).send({
        message: "Admin not found",
      });
    }
    res
      .status(200)
      .send({ message: "Deleted", deleteAdmin: deleteAdmin.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, hashed_password } = req.body;
    const admin = await pool.query("SELECT * FROM admin WHERE email = $1", [
      email,
    ]);

    if (!admin.rows.length) {
      return res.status(400).send({ message: "error in email or password" });
    }

    const validPassword = bcrypt.compareSync(
      hashed_password,
      admin.rows[0].hashed_password
    );

    if (!validPassword) {
      return res.status(400).send({ message: "error in email or password" });
    }

    const payload = {
      id: admin.rows[0].id,
      is_active: admin.rows[0].is_active,
      is_creator: admin.rows[0].is_creator,
    };

    const tokens = myJwt.generateTokens(payload);
    console.log(tokens);

    await pool.query(
      "UPDATE admin SET hashed_refresh_token = $1, is_active = true WHERE id = $2",
      [tokens.refreshToken, admin.rows[0].id]
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

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (refreshToken) {
      const queryText =
        "UPDATE admin SET hashed_refresh_token = $1, is_active = false WHERE hashed_refresh_token = $2 RETURNING *";
      const values = ["", refreshToken];

      const result = await pool.query(queryText, values);

      if (result.rows.length === 0)
        return res.status(400).send({ message: "The Admin is not found" });

      res.clearCookie("refreshToken", { httpOnly: true });
      return res.send({ message: "LOGOUT", admin: result.rows[0] });
    }
    return res
      .status(400)
      .send({ message: "There is no refresh tokens in cookie" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie da refresh topilmadi" });
    }

    const [error, adminDataFromCookie] = await to(
      myJwt.verifyRefreshToken(refreshToken)
    );

    if (error) {
      return res.status(403).send({ message: error.message });
    }

    const adminDataFromDB = await pool.query(
      `
      SELECT * FROM admin WHERE hashed_refresh_token = $1
    `,
      [refreshToken]
    );

    if (adminDataFromDB.rows.length === 0) {
      return res.status(403).send({ message: "Ruxsat etilmagan (Avtor yoq)" });
    }

    const payload = {
      id: adminDataFromDB.rows[0].id,
      is_active: adminDataFromDB.rows[0].is_active,
      is_creator: adminDataFromDB.rows[0].is_creator,
    };

    const tokens = myJwt.generateTokens(payload);

    await pool.query(
      "UPDATE admin SET hashed_refresh_token = $1, is_active = true WHERE id = $2",
      [tokens.refreshToken, adminDataFromDB.rows[0].id]
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
  addAdmin,
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
};
