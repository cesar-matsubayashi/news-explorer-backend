const mongoose = require("mongoose");
const User = require("../models/user");
const fixtures = require("../fixtures/user");
const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);

afterAll(() => {
  return mongoose.disconnect();
});

describe("Requests auth users endpoint", () => {
  afterEach(() => User.deleteMany({}));

  it("POST /signup should create a user", () => {
    const { name, email, password } = fixtures[1].user;

    return request
      .post("/signup")
      .send({ email, password, name })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response._body).toMatchObject({
          email,
          name,
        });
      });
  });

  it("POST /signin should authenticate a user", async () => {
    const { name, email, password } = fixtures[0].user;

    await request.post("/signup").send({
      email,
      password,
      name,
    });

    return request
      .post("/signin")
      .send({
        email,
        password,
      })
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});
