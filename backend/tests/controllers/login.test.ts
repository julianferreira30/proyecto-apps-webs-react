import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import User from "../../src/models/users";
import supertest from "supertest";
import app from "../../src/server";
import helper from "./test_utils";

const api = supertest(app);

describe("Login API tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await api.post("/api/register").send({
      username: "testuser",
      name: "Test User",
      password: "password123",
    });
  });

  test("login succeds with correct credentials", async () => {
    const credentials = {
      username: "testuser",
      password: "password123",
    };
    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.username, credentials.username);
    assert.strictEqual(response.body.name, "Test User");
    assert.ok(!response.body.password);
    assert.ok(!response.body.passwordHash);

    const cookies = response.headers["set-cookie"];
    assert.ok(cookies);
    assert.ok(cookies[0].includes("token="));
    assert.ok(cookies[0].includes("HttpOnly"));

    const csrfToken = response.headers["x-csrf-token"];
    assert.ok(csrfToken);
  });

  test("login succeds with stings with space and UpperCase in username", async () => {
    const credentials = {
      username: " tEstUSer   ",
      password: "password123",
    };
    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.username, "testuser");
    assert.strictEqual(response.body.name, "Test User");
    assert.ok(!response.body.password);
    assert.ok(!response.body.passwordHash);

    const cookies = response.headers["set-cookie"];
    assert.ok(cookies);
    assert.ok(cookies[0].includes("token="));
    assert.ok(cookies[0].includes("HttpOnly"));

    const csrfToken = response.headers["x-csrf-token"];
    assert.ok(csrfToken);
  });

  test("login succeds with stings with space in password", async () => {
    const credentials = {
      username: " tEstUSer   ",
      password: "   password123  ",
    };
    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.username, "testuser");
    assert.strictEqual(response.body.name, "Test User");
    assert.ok(!response.body.password);
    assert.ok(!response.body.passwordHash);

    const cookies = response.headers["set-cookie"];
    assert.ok(cookies);
    assert.ok(cookies[0].includes("token="));
    assert.ok(cookies[0].includes("HttpOnly"));

    const csrfToken = response.headers["x-csrf-token"];
    assert.ok(csrfToken);
  });

  test("login fails with wrong password", async () => {
    const credentials = {
      username: "testuser",
      password: "wrongpassword",
    };
    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "Nombre de usuario o contraseña inválido");
    const cookies = response.headers["set-cookie"];
    assert.ok(!cookies);
  });

  test("login fails with upperrcase password", async () => {
    const credentials = {
      username: "testuser",
      password: "passWord123",
    };
    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "Nombre de usuario o contraseña inválido");
    const cookies = response.headers["set-cookie"];
    assert.ok(!cookies);
  });

  test("login fails whit nonexistent user", async () => {
    const credentials = {
      username: "nonexistentuser",
      password: "password123",
    };

    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "Nombre de usuario o contraseña inválido");
    const cookies = response.headers["set-cookie"];
    assert.ok(!cookies);
  });

  test("get the current user", async () => {
    const loginResponse = await api.post("/api/login").send({
      username: "testuser",
      password: "password123",
    });
    const cookies = loginResponse.headers["set-cookie"];
    const authCookie = cookies[0];
    const csrfToken = loginResponse.headers["x-csrf-token"];
    const userId = loginResponse.body.id;

    await api
      .get("/api/login/auth/me")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const user = await helper.userInDbById(userId);
    assert.strictEqual(user?.username, "testuser");
    assert.strictEqual(user?.name, "Test User");
  });

  test("get the current user requires authentication", async () => {
    const response = await api
      .get("/api/login/auth/me")
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("missing token"));
  });

  test("get the current user fails with invalid CSRF token", async () => {
    const loginResponse = await api.post("/api/login").send({
      username: "testuser",
      password: "password123",
    });
    const cookies = loginResponse.headers["set-cookie"];
    const authCookie = cookies[0];
    const response = await api
      .get("/api/login/auth/me")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", "invalid-csrf-token")
      .expect(401);

    assert(response.body.error.includes("invalid token"));
  });

  test("logout clean the token of the user", async () => {
    const loginResponse = await api.post("/api/login").send({
      username: "testuser",
      password: "password123",
    });
    const cookies = loginResponse.headers["set-cookie"];
    const authCookie = cookies[0];
    const csrfToken = loginResponse.headers["x-csrf-token"];
    const userId = loginResponse.body.id;
    const response = await api
      .post("/api/login/logout")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.headers["set-cookie"][0], 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
    assert(response.body.message.includes("Cierre de sesión exitoso"));
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
