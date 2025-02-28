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
  await Article.deleteMany({});
  mongoose.disconnect();
});

describe("Requests article endpoint", () => {
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
  } = articlefixtures[1];
  it("POST /articles should create a article", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        title,
        description,
        content,
        publishedAt,
        source: source.name,
        author,
        url,
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response._body).toMatchObject({
          keyword,
          title,
          description,
          content,
          publishedAt,
          source: source.name,
          author,
          url,
          urlToImage,
          owner: owner._id,
        });
      });
  });

  it("POST /articles should throw authentication error", async () => {
    return request
      .post("/articles")
      .send({
        keyword,
        title,
        description,
        content,
        publishedAt,
        source: source.name,
        author,
        url,
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response._body).toMatchObject({
          message: "Autorização necessária",
        });
      });
  });

  it("POST /articles should throw keyword is required", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        title,
        description,
        content,
        publishedAt,
        source: source.name,
        author,
        url,
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"keyword" is required'
        );
      });
  });

  it("POST /articles should throw title is required", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        description,
        content,
        publishedAt,
        source: source.name,
        author,
        url,
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"title" is required'
        );
      });
  });

  it("POST /articles should throw description is required", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        title,
        content,
        publishedAt,
        source: source.name,
        author,
        url,
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"description" is required'
        );
      });
  });

  it("POST /articles should throw content is required", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        title,
        description,
        publishedAt,
        source: source.name,
        author,
        url,
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"content" is required'
        );
      });
  });

  it("POST /articles should throw publishedAt is required", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        title,
        description,
        content,
        source: source.name,
        author,
        url,
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"publishedAt" is required'
        );
      });
  });

  it("POST /articles should throw source is required", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        title,
        description,
        content,
        publishedAt,
        author,
        url,
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"source" is required'
        );
      });
  });

  it("POST /articles should throw author is required", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        title,
        description,
        content,
        publishedAt,
        source: source.name,
        url,
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"author" is required'
        );
      });
  });

  it("POST /articles should throw url is required", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        title,
        description,
        content,
        publishedAt,
        source: source.name,
        author,
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"url" is required'
        );
      });
  });

  it("POST /articles should throw url is invalid", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        title,
        description,
        content,
        publishedAt,
        source: source.name,
        author,
        url: "bad url",
        urlToImage,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"url" must be a valid uri'
        );
      });
  });

  it("POST /articles should throw urlToImage is required", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        title,
        description,
        content,
        publishedAt,
        source: source.name,
        author,
        url,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"urlToImage" is required'
        );
      });
  });

  it("POST /articles should throw urlToImage is invalid", async () => {
    return request
      .post("/articles")
      .set("Authorization", token)
      .send({
        keyword,
        title,
        description,
        content,
        publishedAt,
        source: source.name,
        author,
        url,
        urlToImage: "bad url",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response._body.message).toBe("Validation failed");
        expect(response._body.validation.body.message).toBe(
          '"urlToImage" must be a valid uri'
        );
      });
  });
});
