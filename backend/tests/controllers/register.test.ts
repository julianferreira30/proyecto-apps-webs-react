import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import GameModel from "../../src/models/game";
import supertest from "supertest";
import app from "../../src/index";
import User from "../../src/models/users";

const api = supertest(app);
describe("Register API tests", () => {
  beforeEach(async () => {
    // Antes de cada test, limpiar los usuarios
    await User.deleteMany({});
  });

  test("POST /api/register creates a new user", async () => {
    const newUser = {
      username: "testUser",
      name: "Test User",
      password: "password",
    };

    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.username, newUser.username);
    assert.strictEqual(response.body.name, newUser.name);
    assert.ok(response.body.id);
    assert.ok(!response.body.password);
    assert.ok(!response.body.passwordHash);
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 1);
    assert.strictEqual(usersInDb[0].username, newUser.username);
    assert.deepStrictEqual(usersInDb[0].favourites, []);
    assert.deepStrictEqual(usersInDb[0].wishlist, []);
  });

  test("POST /api/register fails without username", async () => {
    const newUser = {
      name: "Test User",
      password: "password",
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(
      response.body.error,
      "username, name and password required"
    );
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("POST /api/register fails without password", async () => {
    const newUser = {
      name: "Test User",
      username: "Test User",
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(
      response.body.error,
      "username, name and password required"
    );
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });
  test("POST /api/register fails without name", async () => {
    const newUser = {
      username: "Test User",
      password: "password123",
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(
      response.body.error,
      "username, name and password required"
    );
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });
  test("POST /api/register fails with duplicated usernames", async () => {
    const newUser = {
      username: "testUser",
      name: "Test User",
      password: "password",
    };

    await api.post("/api/register").send(newUser).expect(201);

    const newUser2 = {
      username: "testUser",
      name: "Test User2",
      password: "password",
    };
    const response = await api
      .post("/api/register")
      .send(newUser2)
      .expect(409)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "username already exists");
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 1);
    assert.strictEqual(usersInDb[0].name, newUser.name);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
