const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");
const ForbiddenError = require("../errors/ForbiddenError");
const Article = require("../models/article");
const NoContent = require("../errors/NoContent");

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

  // Article.find({ owner })
  //   .orFail(() => Promise.reject(new Error("NoContent")))
  //   .then((article) => {
  //     res.send(article);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     if (err.message === "NoContent") {
  //       return res.status(204).send([]);
  //     }

  //     next(err);
  //   });

  Article.find({ owner })
    .orFail(() => {
      throw new NoContent("NoContent");
    })
    .then((articles) => {
      res.send(articles);
    })
    .catch((err) => {
      if (err.message === "NoContent") {
        return res.status(204).end();
      }
      next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(() => {
      throw new NoContent("NoContent");
    })
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError("Permissão negada para o recurso requisitado");
      }

      return Article.findByIdAndDelete(article._id);
    })
    .then((deleted) => {
      res.send(deleted);
    })
    .catch((err) => {
      if (err.message === "NoContent") {
        return res.status(204).end();
      }
      next(err);
    });
};
