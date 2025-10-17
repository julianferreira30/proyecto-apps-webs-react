import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import User from "../src/models/users";
import supertest from "supertest";
import app from "../src/index";

const api = supertest(app);

describe("Login API tests", () => {
  beforeEach(async () => {
    // Borramos los usuarios antiguos
    await User.deleteMany({});
    // Creamos un usuario de prueba
    await api.post("/api/register").send({
      username: "testuser",
      name: "Test User",
      password: "password123",
    });
  });
  test("POST /api/login succeds with correct credentiasl", async () => {
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
    // Verificar que hay una cookie httpOnly
    const cookies = response.headers["set-cookie"];
    assert.ok(cookies);
    assert.ok(cookies[0].includes("token="));
    assert.ok(cookies[0].includes("HttpOnly"));

    // Verificar que hay un CSRF token en los headers
    const csrfToken = response.headers["x-csrf-token"];
    assert.ok(csrfToken);
  });
  test("POST /api/login fails with wrong password", async () => {
    const credentials = {
      username: "testuser",
      password: "wrongpassword",
    };
    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(401)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(response.body.error, "invalid username or password");
    const cookies = response.headers["set-cookie"];
    assert.ok(!cookies);
  });
  test("POST /api/login fails whit nonexistent user", async () => {
    const credentials = {
      username: "nonexistentuser",
      password: "password123",
    };
    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(401)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(response.body.error, "invalid username or password");
    const cookies = response.headers["set-cookie"];
    assert.ok(!cookies);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
