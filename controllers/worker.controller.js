const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { workerValidation } = require("../validations/Worker");
const uuid = require("uuid");
const mail_service = require("../service/mail_service");
const config = require("config");
const myJwt = require("../service/jwt_service");
const { to } = require("../helpers/to_promise");

const addWorker = async (req, res) => {
  try {
    const { error, value } = workerValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      first_name,
      last_name,
      birth_date,
      gender,
      passport,
      phone_number,
      email,
      tg_link,
      hashed_password,
      hashed_refresh_token,
      is_active,
      graduate,
      skills,
      exprience,
    } = value;

    const hashedPassword = bcrypt.hashSync(hashed_password, 7);

    const worker_activation_link = uuid.v4();

    const newWorker = await pool.query(
      `
      INSERT INTO worker (first_name,
      last_name,
      birth_date,
      gender,
      passport,
      phone_number,
      email,
      tg_link,
      hashed_password,
      hashed_refresh_token,
      is_active,
      graduate,
      skills,
      exprience,
      worker_activation_link
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *
      `,
      [
        first_name,
        last_name,
        birth_date,
        gender,
        passport,
        phone_number,
        email,
        tg_link,
        hashedPassword,
        hashed_refresh_token,
        is_active,
        graduate,
        skills,
        exprience,
        worker_activation_link,
      ]
    );

    console.log("1");
    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/worker/activate/${worker_activation_link}`
    );
    console.log("2");

    const payload = {
      id: newWorker.rows[0].id,
      is_active: newWorker.rows[0].is_active,
    };

    const tokens = myJwt.generateTokens(payload);
    console.log(tokens);

    await pool.query(
      "UPDATE worker SET hashed_refresh_token = $1 WHERE id = $2",
      [tokens.refreshToken, newWorker.rows[0].id]
    );

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.status(201).send(newWorker.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getAllWorker = async (req, res) => {
  try {
    const getWorker = await pool.query(
      `
        SELECT * FROM worker
      `
    );
    res.status(200).send(getWorker.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;
    const getWorker = await pool.query(
      `
        SELECT * FROM worker WHERE id = $1
      `,
      [id]
    );
    if (getWorker.rows.length == 0) {
      return res.status(404).send({
        message: "Worker not found",
      });
    }
    res.status(200).send(getWorker.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const updateWorker = async (req, res) => {
  try {
    const { error, value } = workerValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      first_name,
      last_name,
      birth_date,
      gender,
      passport,
      phone_number,
      email,
      tg_link,
      hashed_password,
      hashed_refresh_token,
      is_active,
      graduate,
      skills,
      exprience,
    } = value;
    const { id } = req.params;

    const hashedPassword = bcrypt.hashSync(hashed_password, 7);

    const updateWorker = await pool.query(
      `
        UPDATE worker SET first_name = $1,
      last_name = $2,
      birth_date = $3,
      gender = $4,
      passport = $5,
      phone_number = $6,
      email = $7,
      tg_link = $8,
      hashed_password = $9,
      hashed_refresh_token = $10,
      is_active = $11,
      graduate = $12,
      skills = $13,
      exprience = $14
        WHERE id = $15 RETURNING *
      `,
      [
        first_name,
        last_name,
        birth_date,
        gender,
        passport,
        phone_number,
        email,
        tg_link,
        hashed_password,
        hashed_refresh_token,
        is_active,
        graduate,
        skills,
        exprience,
        id,
      ]
    );
    if (updateWorker.rows.length == 0) {
      return res.status(404).send({
        message: "Worker not found",
      });
    }
    res
      .status(200)
      .send({ message: "Updated", updateWorker: updateWorker.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteWorker = await pool.query(
      `
        DELETE FROM worker WHERE id = $1 RETURNING *
      `,
      [id]
    );
    if (deleteWorker.rows.length == 0) {
      return res.status(404).send({
        message: "Worker not found",
      });
    }
    res
      .status(200)
      .send({ message: "Deleted", deleteWorker: deleteWorker.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

const workerActivate = async (req, res) => {
  try {
    const worker = await pool.query(
      `
        SELECT * FROM worker WHERE worker_activation_link = $1
      `,
      [req.params.link]
    );

    if (!worker) {
      return res.status(400).send({ message: "Bunday worker topilmadi" });
    }

    if (worker.rows[0].is_active == true) {
      return res.status(400).send({ message: "Worker allaqachon active" });
    }

    const newWorker = await pool.query(
      "UPDATE worker SET is_active = true WHERE id = $1 RETURNING *",
      [worker.rows[0].id]
    );

    res.send({
      worker_is_active: newWorker.rows[0].is_active,
      message: "Worker faollashdi",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

const loginWorker = async (req, res) => {
  try {
    const { email, hashed_password } = req.body;
    const worker = await pool.query("SELECT * FROM worker WHERE email = $1", [
      email,
    ]);

    if (!worker.rows.length) {
      return res.status(400).send({ message: "error in email or password" });
    }

    const validPassword = bcrypt.compareSync(
      hashed_password,
      worker.rows[0].hashed_password
    );

    if (!validPassword) {
      return res.status(400).send({ message: "error in email or password" });
    }

    const payload = {
      id: worker.rows[0].id,
    };

    const tokens = myJwt.generateTokens(payload);
    console.log(tokens);

    await pool.query(
      "UPDATE worker SET hashed_refresh_token = $1 WHERE id = $2",
      [tokens.refreshToken, worker.rows[0].id]
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

const logoutWorker = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (refreshToken) {
      const queryText =
        "UPDATE worker SET hashed_refresh_token = $1 WHERE hashed_refresh_token = $2 RETURNING *";
      const values = ["", refreshToken];

      const result = await pool.query(queryText, values);

      if (result.rows.length === 0)
        return res.status(400).send({ message: "The Worker is not found" });

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

const refreshWorkerToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie da refresh topilmadi" });
    }

    const [error, wokerDataFromCookie] = await to(
      myJwt.verifyRefreshToken(refreshToken)
    );

    if (error) {
      return res.status(403).send({ message: error.message });
    }

    const workerDataFromDB = await pool.query(
      `
      SELECT * FROM worker WHERE hashed_refresh_token = $1
    `,
      [refreshToken]
    );

    if (workerDataFromDB.rows.length === 0) {
      return res.status(403).send({ message: "Ruxsat etilmagan (Avtor yoq)" });
    }

    const payload = {
      id: workerDataFromDB.rows[0].id,
    };

    const tokens = myJwt.generateTokens(payload);

    await pool.query(
      "UPDATE worker SET hashed_refresh_token = $1 WHERE id = $2",
      [tokens.refreshToken, workerDataFromDB.rows[0].id]
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
  addWorker,
  getAllWorker,
  getWorkerById,
  updateWorker,
  deleteWorker,
  workerActivate,
  loginWorker,
  logoutWorker,
  refreshWorkerToken,
};
