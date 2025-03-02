const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new NotFoundError("Recurso requisitado não encontrado");
    })
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    User.create({ email, password: hash, name })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === "ValidationError") {
          return next(new ValidationError(err.message));
        }

        return next();
      })
  );
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("Recurso requisitado não encontrado");
    })
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );

      res.send({ token });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ValidationError(err.message));
      }

      return next();
    });
};
