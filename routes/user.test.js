const mongoose = require("mongoose");
const User = require("../models/user");
const fixtures = require("../fixtures/user");
const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
let token;

beforeAll(async () => {
  await request.post("/signup").send({
    email: fixtures[0].user.email,
    password: fixtures[0].user.password,
    name: fixtures[0].user.name,
  });

  await request.post("/signup").send({
    email: fixtures[1].user.email,
    password: fixtures[1].user.password,
    name: fixtures[1].user.name,
  });

  const response = await request.post("/signin").send({
    email: fixtures[1].user.email,
    password: fixtures[1].user.password,
  });

  token = response._body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  mongoose.disconnect();
});

describe("Requests private users endpoint", () => {
  it("GET /users should return all users", async () => {
    return request
      .get("/users")
      .set("Authorization", token)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response._body).toMatchObject([
          {
            email: fixtures[0].user.email,
            name: fixtures[0].user.name,
          },
          {
            email: fixtures[1].user.email,
            name: fixtures[1].user.name,
          },
        ]);
      });
  });

  it("GET /users/me should return current user", async () => {
    return request
      .get("/users/me")
      .set("Authorization", token)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response._body).toMatchObject({
          email: fixtures[1].user.email,
          name: fixtures[1].user.name,
        });
      });
  });
});
