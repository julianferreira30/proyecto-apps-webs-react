import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../src/server";
import User from "../../src/models/users";

const api = supertest(app);

describe("Register API tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("create a new user", async () => {
    const newUser = {
      profile_image: "https://example.png    ",
      username: " TESTUser ",
      name: "Test User  ",
      password: "password   ",
    };

    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.username, "testuser");
    assert.strictEqual(response.body.name, "Test User");
    assert.strictEqual(response.body.profile_image, "https://example.png");
    assert.ok(response.body.id);
    assert.ok(!response.body.password);
    assert.ok(!response.body.passwordHash);

    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 1);
    assert.strictEqual(usersInDb[0].name, "Test User");
    assert.strictEqual(usersInDb[0].username, "testuser");
    assert.strictEqual(usersInDb[0].profile_image, "https://example.png");
    assert.deepStrictEqual(usersInDb[0].added, []);
    assert.deepStrictEqual(usersInDb[0].played, []);
    assert.deepStrictEqual(usersInDb[0].favorites, []);
    assert.deepStrictEqual(usersInDb[0].wishlist, []);
    assert.deepStrictEqual(usersInDb[0].reviews, []);
  });

  test("create a new user fails without username", async () => {
    const newUser = {
      profile_image: "https://example.png",
      name: "Test User",
      password: "password",
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("create a new user fails without password", async () => {
    const newUser = {
      profile_image: "https://example.png",
      name: "Test User",
      username: "Test User",
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("create a new user fails without name", async () => {
    const newUser = {
      profile_image: "https://example.png",
      username: "Test User",
      password: "password123",
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("create a new user fails with username in the incorrect format", async () => {
    const newUser = {
      profile_image: "https://example.png",
      username: "",
      name: "Test User",
      password: "password",
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("create a new user fails with password in the incorrect format", async () => {
    const newUser = {
      profile_image: "https://example.png",
      username: "Test User",
      name: "Test User",
      password: 2025,
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("create a new user fails with name in the incorrect format", async () => {
    const newUser = {
      profile_image: "https://example.png",
      username: "Test User",
      name: ["test user"],
      password: "password123",
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("create a new user fails with profile_image in the incorrect format", async () => {
    const newUser = {
      profile_image: "https://examplepng",
      username: "Test User",
      name: ["test user"],
      password: "password123",
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 0);
  });

  test("create a new user without profile image succeds", async () => {
    const newUser = {
      username: "Test User",
      name: "Test User",
      password: "password123",
    };
    const response = await api
      .post("/api/register")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    assert.strictEqual(response.body.username, "test user");
    assert.strictEqual(response.body.name, "Test User");
    assert.strictEqual(response.body.profile_image, "/broken-image.jpg");
    assert.ok(response.body.id);
    assert.ok(!response.body.password);
    assert.ok(!response.body.passwordHash);

    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 1);
    assert.strictEqual(usersInDb[0].name, "Test User");
    assert.strictEqual(usersInDb[0].username, "test user");
    assert.strictEqual(usersInDb[0].profile_image, "/broken-image.jpg");
    assert.deepStrictEqual(usersInDb[0].added, []);
    assert.deepStrictEqual(usersInDb[0].played, []);
    assert.deepStrictEqual(usersInDb[0].favorites, []);
    assert.deepStrictEqual(usersInDb[0].wishlist, []);
    assert.deepStrictEqual(usersInDb[0].reviews, []);
  });

  test("create a new user fails with duplicated usernames", async () => {
    const newUser = {
      profile_image: "https://example.png",
      username: "testUser",
      name: "Test User",
      password: "password",
    };
    await api
    .post("/api/register")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

    const newUser2 = {
      username: "TESTUser",
      name: "Test User2",
      password: "password",
    };
    const response = await api
      .post("/api/register")
      .send(newUser2)
      .expect(409)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("El nombre de usuario dado ya existe"));
    const usersInDb = await User.find({});
    assert.strictEqual(usersInDb.length, 1);
    assert.strictEqual(usersInDb[0].name, "Test User");
    assert.strictEqual(usersInDb[0].username, "testuser");
    assert.strictEqual(usersInDb[0].profile_image, "https://example.png");
    assert.deepStrictEqual(usersInDb[0].added, []);
    assert.deepStrictEqual(usersInDb[0].played, []);
    assert.deepStrictEqual(usersInDb[0].favorites, []);
    assert.deepStrictEqual(usersInDb[0].wishlist, []);
    assert.deepStrictEqual(usersInDb[0].reviews, []);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
