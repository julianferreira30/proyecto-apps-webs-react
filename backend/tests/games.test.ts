import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import GameModel from "../src/models/game";
import supertest from "supertest";
import app from "../src/index";
import games from "../db.json";
import User from "../src/models/users";
const api = supertest(app);

interface GameJson {
  id: string;
  name: string;
  release_year: number;
  creator: string;
  genre: string[];
  image: string;
  description: string;
  rating: number;
}

let zeldaId: string;
let authCookie: string;
let csrfToken: string;

describe("GameBoxd API integration tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await GameModel.deleteMany({});

    await api.post("/api/register").send({
      username: "testuser",
      name: "Test User",
      password: "password123",
    });
    const loginResponse = await api.post("/api/login").send({
      username: "testuser",
      password: "password123",
    });
    const cookies = loginResponse.headers["set-cookie"];
    authCookie = cookies[0];
    csrfToken = loginResponse.headers["x-csrf-token"];

    const zelda = new GameModel(games.games[0]);
    await zelda.save();
    zeldaId = zelda._id.toString();
    const mario = new GameModel(games.games[1]);
    await mario.save();
  });

  test("GET /api/games", async () => {
    const response = await api.get("/api/games");
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.length, 2);
  });

  test("GET /api/games/:id", async () => {
    const response = await api.get(`/api/games/${zeldaId}`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(
      response.body.name,
      "The Legend of Zelda: Ocarina of Time"
    );
  });

  test("POST /api/games", async () => {
    const newGame: GameJson = {
      id: "",
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Test Genre"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear",
      rating: 0,
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame);
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.name, newGame.name);

    const getResponse = await api.get("/api/games");
    assert.strictEqual(getResponse.body.length, 3);
  });

  test("PUT /api/games/:id", async () => {
    const updatedGame: GameJson = {
      id: zeldaId,
      name: "The Legend of Zelda: Ocarina of Time",
      release_year: 2025,
      creator: "...",
      genre: ["..."],
      image: "...",
      description: "...",
      rating: 0,
    };
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.release_year, updatedGame.release_year);
    assert.strictEqual(
      response.body.name,
      "The Legend of Zelda: Ocarina of Time"
    );
  });

  test("DELETE /api/games/:id", async () => {
    const response = await api
      .delete(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken);
    assert.strictEqual(response.status, 204);

    const getResponse = await api.get("/api/games");
    assert.strictEqual(getResponse.body.length, 1);
  });
  test("POST /api/games requires authentication", async () => {
    const newGame: GameJson = {
      id: "",
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Test Genre"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear",
      rating: 0,
    };
    const responseWithoutAuth = await api
      .post("/api/games")
      .send(newGame)
      .expect(401);
    assert.strictEqual(responseWithoutAuth.body.error, "missing token");
    const getResponse1 = await api.get("/api/games");
    assert.strictEqual(getResponse1.body.length, 2);
    // En cambio si está autenticado debe funcionar.
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame);

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.name, newGame.name);

    const getResponse = await api.get("/api/games");
    assert.strictEqual(getResponse.body.length, 3);
  });
  test("POST /api/games fails with invalid CSRF token", async () => {
    const newGame: GameJson = {
      id: "",
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Test Genre"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear",
      rating: 0,
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", "invalid-csrf-token")
      .send(newGame)
      .expect(401);

    assert.strictEqual(response.body.error, "invalid token");
    // Verificamos que no se agregó el juego
    const getResponse = await api.get("/api/games");
    assert.strictEqual(getResponse.body.length, 2);
  });
  test("PUT /api/games/:id requires authentication", async () => {
    const updatedGame: GameJson = {
      id: zeldaId,
      name: "The Legend of Zelda: Ocarina of Time",
      release_year: 2025,
      creator: "Nintendo",
      genre: ["Adventure"],
      image: "http://example.com/zelda.jpg",
      description: "Juego de acción-aventura",
      rating: 0,
    };

    // Sin autenticación debe fallar
    const responseWithoutAuth = await api
      .put(`/api/games/${zeldaId}`)
      .send(updatedGame)
      .expect(401);

    assert.strictEqual(responseWithoutAuth.body.error, "missing token");

    // Con autenticación debe funcionar
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.release_year, updatedGame.release_year);
    assert.strictEqual(
      response.body.name,
      "The Legend of Zelda: Ocarina of Time"
    );
  });
  test("PUT /api/games/:id fails with invalid CSRF token", async () => {
    const updatedGame: GameJson = {
      id: zeldaId,
      name: "The Legend of Zelda: Ocarina of Time",
      release_year: 2025,
      creator: "Nintendo",
      genre: ["Adventure"],
      image: "http://example.com/zelda.jpg",
      description: "Juego de acción-aventura",
      rating: 0,
    };

    // Con cookie pero CSRF token inválido
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", "invalid-csrf-token")
      .send(updatedGame)
      .expect(401);

    assert.strictEqual(response.body.error, "invalid token");
  });
  test("DELETE /api/games/:id requires authentication", async () => {
    // Sin autenticación debe fallar
    const responseWithoutAuth = await api
      .delete(`/api/games/${zeldaId}`)
      .expect(401);

    assert.strictEqual(responseWithoutAuth.body.error, "missing token");

    // Verificar que el juego sigue existiendo
    const getResponseBefore = await api.get("/api/games");
    assert.strictEqual(getResponseBefore.body.length, 2);

    // Con autenticación debe funcionar
    const response = await api
      .delete(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken);

    assert.strictEqual(response.status, 204);

    const getResponse = await api.get("/api/games");
    assert.strictEqual(getResponse.body.length, 1);
  });
  test("DELETE /api/games/:id fails with invalid CSRF token", async () => {
    // Con cookie pero CSRF token inválido
    const response = await api
      .delete(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", "invalid-csrf-token")
      .expect(401);

    assert.strictEqual(response.body.error, "invalid token");

    // Verificar que el juego NO se eliminó
    const getResponse = await api.get("/api/games");
    assert.strictEqual(getResponse.body.length, 2);
  });
  after(async () => {
    await mongoose.connection.close();
  });
});
