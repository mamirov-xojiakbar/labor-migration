const express = require("express");
const config = require("config");
const cookieParser = require("cookie-parser");
const PORT = config.get("port");

const mainRouter = require("./routes/index.routes");

const error_handing_middleware = require("./middleware/error_handing_middleware");

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(require("./middleware/logger"));

app.use(require("./middleware/errorLogger"));

app.use("/api", mainRouter);

app.use(error_handing_middleware);

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
