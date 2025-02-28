const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");
const Article = require("../models/article");

module.exports.creatArticle = (req, res, next) => {
  const {
    keyword,
    title,
    description,
    content,
    publishedAt,
    source,
    author,
    url,
    urlToImage,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword,
    title,
    description,
    content,
    publishedAt,
    source,
    author,
    url,
    urlToImage,
    owner,
  })
    .then((article) => res.send(article))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ValidationError(err.message));
      }

      return next();
    });
};

module.exports.getArticles = (req, res, next) => {
  const owner = req.user._id;

  Article.find({ owner })
    .orFail(() => {
      throw new NotFoundError("Recurso requisitado não encontrado");
    })
    .then((article) => res.send(article))
    .catch(next);
};
