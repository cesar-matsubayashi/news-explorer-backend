const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const userAuth = require("./routes/auth");
const users = require("./routes/user");
const articles = require("./routes/article");
const auth = require("./middleware/auth");
const { requestLogger, errorLogger } = require("./middleware/logger");
const cors = require("cors");
const base64 = require("./middleware/base64");

const { PORT = 3000, NODE_ENV, DB_URI } = process.env;
const app = express();

app.use(cors());
app.options("*", cors());

if (NODE_ENV === "test") {
  mongoose.connect(`${DB_URI}test`);
} else {
  mongoose.connect(DB_URI);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(base64);

app.use(requestLogger);

app.use("/", userAuth);

app.use(auth);

app.use("/users", users);
app.use("/articles", articles);

app.get("*", (req, res) => {
  res.status(404).send({ message: "A solicitação não foi encontrada" });
});

if (NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
  });
}

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "Ocorreu um erro no servidor" : message,
  });
});

module.exports = app;
