const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const userAuth = require("./routes/auth");
const users = require("./routes/user");
const articles = require("./routes/article");
const auth = require("./middleware/auth");

const { PORT = 3000, NODE_ENV } = process.env;
const app = express();

if (NODE_ENV !== "test") {
  mongoose.connect("mongodb://localhost:27017/newsexplorer");
} else {
  mongoose.connect("mongodb://localhost:27017/newsexplorertest");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "Ocorreu um erro no servidor" : message,
  });
});

module.exports = app;
