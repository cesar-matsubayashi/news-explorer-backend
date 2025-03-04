const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const { celebrate, Joi } = require("celebrate");
const { createUser, login } = require("../controllers/user");

router.post(
  "/signup",
  upload.none(),
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

module.exports = router;
