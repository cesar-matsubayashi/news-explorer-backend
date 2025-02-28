const mongoose = require("mongoose");
const articlefixtures = require("../fixtures/article");
const userFixtures = require("../fixtures/user");
const Article = require("../models/article");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
let token;
let owner;

beforeAll(async () => {
  const { email, password, name } = userFixtures[1].user;

  await request.post("/signup").send({ email, password, name });
  const response = await request.post("/signin").send({ email, password });

  token = response.body.token;
  owner = jwt.verify(token, "dev-secret");
});

afterAll(async () => {
  await User.deleteMany({});
  mongoose.disconnect();
});

describe("Requests article endpoint", () => {
  afterEach(async () => await Article.deleteMany({}));

  it("POST /articles should create a article", async () => {
    const returnArticle = { ...articlefixtures[0] };
    returnArticle.owner = owner._id;

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(returnArticle);
      });
  });

  it("POST /articles should throw authentication error", async () => {
    return request
      .post("/articles")
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          message: "Autorização necessária",
        });
      });
  });

  it("POST /articles should throw keyword is required", async () => {
    const article = { ...articlefixtures[0] };
    delete article.keyword;

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe(
          '"keyword" is required'
        );
      });
  });

  it("POST /articles should throw title is required", async () => {
    const article = { ...articlefixtures[0] };
    delete article.title;

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe(
          '"title" is required'
        );
      });
  });

  it("POST /articles should throw description is required", async () => {
    const article = { ...articlefixtures[0] };
    delete article.description;

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe(
          '"description" is required'
        );
      });
  });

  it("POST /articles should throw content is required", async () => {
    const article = { ...articlefixtures[0] };
    delete article.content;

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe(
          '"content" is required'
        );
      });
  });

  it("POST /articles should throw publishedAt is required", async () => {
    const article = { ...articlefixtures[0] };
    delete article.publishedAt;

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe(
          '"publishedAt" is required'
        );
      });
  });

  it("POST /articles should throw source is required", async () => {
    const article = { ...articlefixtures[0] };
    delete article.source;

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe(
          '"source" is required'
        );
      });
  });

  it("POST /articles should throw author is required", async () => {
    const article = { ...articlefixtures[0] };
    delete article.author;

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe(
          '"author" is required'
        );
      });
  });

  it("POST /articles should throw url is required", async () => {
    const article = { ...articlefixtures[0] };
    delete article.url;

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe('"url" is required');
      });
  });

  it("POST /articles should throw url is invalid", async () => {
    const article = { ...articlefixtures[0] };
    article.url = "bad url";

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe(
          '"url" must be a valid uri'
        );
      });
  });

  it("POST /articles should throw urlToImage is required", async () => {
    const article = { ...articlefixtures[0] };
    delete article.urlToImage;

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe(
          '"urlToImage" is required'
        );
      });
  });

  it("POST /articles should throw urlToImage is invalid", async () => {
    const article = { ...articlefixtures[0] };
    article.urlToImage = "bad url";

    return request
      .post("/articles")
      .set("Authorization", token)
      .send(article)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.validation.body.message).toBe(
          '"urlToImage" must be a valid uri'
        );
      });
  });

  it("GET /articles should return all article from auth user", async () => {
    const returnArticle = { ...articlefixtures[0] };
    const returnArticle2 = { ...articlefixtures[1] };
    returnArticle.owner = owner._id;
    returnArticle2.owner = owner._id;

    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(returnArticle);
      });

    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[1])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(returnArticle2);
      });

    return request
      .get("/articles")
      .set("Authorization", token)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([returnArticle, returnArticle2]);
      });
  });
  it("GET /articles should should throw not found error", async () => {
    const returnArticle = { ...articlefixtures[0] };
    returnArticle.owner = owner._id;

    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(returnArticle);
      });

    const { email, password, name } = userFixtures[0].user;

    await request.post("/signup").send({ email, password, name });
    const response = await request.post("/signin").send({ email, password });

    const token2 = response.body.token;

    return request
      .get("/articles")
      .set("Authorization", token2)
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });

  it("GET /articles should should throw authentication error", async () => {
    const returnArticle = { ...articlefixtures[0] };
    returnArticle.owner = owner._id;

    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(returnArticle);
      });

    return request.get("/articles").then((response) => {
      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        message: "Autorização necessária",
      });
    });
  });

  it("DELETE /articles/:articleId should delete article", async () => {
    const returnArticle = { ...articlefixtures[0] };
    returnArticle.owner = owner._id;

    let articleId;

    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(returnArticle);
        articleId = response.body._id;
      });

    return request
      .delete(`/articles/${articleId}`)
      .set("Authorization", token)
      .then((response) => {
        returnArticle._id = articleId;
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(returnArticle);
      });
  });

  it("DELETE /articles/:articleId should throw validation error", async () => {
    const returnArticle = { ...articlefixtures[0] };
    returnArticle.owner = owner._id;

    let articleId;

    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(returnArticle);
        articleId = response.body._id;
      });

    const wrongFormatId = articleId.slice(1);

    return request
      .delete(`/articles/${wrongFormatId}`)
      .set("Authorization", token)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.validation.params.message).toBe(
          '"articleId" length must be 24 characters long'
        );
      });
  });

  it("DELETE /articles/:articleId should throw not found error", async () => {
    const returnArticle = { ...articlefixtures[0] };
    returnArticle.owner = owner._id;

    let articleId;

    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(returnArticle);
        articleId = response.body._id;
      });

    const wrongArticleId = articleId.replace(
      articleId.charAt(1),
      articleId.charAt(2)
    );

    return request
      .delete(`/articles/${wrongArticleId}`)
      .set("Authorization", token)
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });

  it("DELETE /articles/:articleId should should throw forbidden error", async () => {
    const returnArticle = { ...articlefixtures[0] };
    returnArticle.owner = owner._id;

    let articleId;
    let token2;

    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(returnArticle);
        articleId = response.body._id;
      });

    const { email, password, name } = userFixtures[0].user;

    await request.post("/signup").send({ email, password, name });

    await request
      .post("/signin")
      .send({ email, password })
      .then((response) => {
        token2 = response.body.token;
      });

    return request
      .delete(`/articles/${articleId}`)
      .set("Authorization", token2)
      .then((response) => {
        expect(response.status).toBe(403);
      });
  });
});
