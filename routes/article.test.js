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

  await request.post("/users").send({ email, password, name });
  const response = await request.post("/users/login").send({ email, password });

  token = response._body.token;
  owner = jwt.verify(token, "dev-secret");
});

afterAll(async () => {
  await User.deleteMany({});
  mongoose.disconnect();
});

describe("Requests article endpoint", () => {
  afterEach(async () => await Article.deleteMany({}));
  it("POST /articles should create a article", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response._body).toMatchObject(articlefixtures[0]);
      });
  });

  it("POST /articles should throw authentication error", async () => {
    return request
      .post("/articles")
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response._body).toMatchObject({
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"url" is required'
        );
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
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
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"urlToImage" must be a valid uri'
        );
      });
  });

  it("GET /articles should return all article from auth user", async () => {
    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response._body).toMatchObject(articlefixtures[0]);
      });

    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[1])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response._body).toMatchObject(articlefixtures[1]);
      });

    return request
      .get("/articles")
      .set("Authorization", token)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response._body).toMatchObject([
          articlefixtures[0],
          articlefixtures[1],
        ]);
      });
  });
  it("GET /articles should should throw not found error", async () => {
    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response._body).toMatchObject(articlefixtures[0]);
      });

    const { email, password, name } = userFixtures[0].user;

    await request.post("/users").send({ email, password, name });
    const response = await request
      .post("/users/login")
      .send({ email, password });

    const token2 = response._body.token;

    return request
      .get("/articles")
      .set("Authorization", token2)
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });

  it("GET /articles should should throw authentication error", async () => {
    await request
      .post("/articles")
      .set("Authorization", token)
      .send(articlefixtures[0])
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response._body).toMatchObject(articlefixtures[0]);
      });

    return request.get("/articles").then((response) => {
      expect(response.status).toBe(401);
      expect(response._body).toMatchObject({
        message: "Autorização necessária",
      });
    });
  });
});
