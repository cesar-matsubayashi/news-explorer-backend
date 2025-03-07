const router = require("express").Router();
const validator = require("validator");
const { celebrate, Joi } = require("celebrate");
const {
  creatArticle,
  getArticles,
  deleteArticle,
} = require("../controllers/article");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value, { require_protocol: true })) {
    return value;
  }

  return helpers.error("string.uri");
};

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      content: Joi.string().required(),
      publishedAt: Joi.string().required(),
      source: Joi.string().required(),
      author: Joi.string().required(),
      url: Joi.string().required().custom(validateUrl),
      urlToImage: Joi.string().required().custom(validateUrl),
    }),
  }),
  creatArticle
);

router.get("/", getArticles);

router.delete(
  "/:articleId",
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().alphanum().length(24).required(),
    }),
  }),
  deleteArticle
);

module.exports = router;
