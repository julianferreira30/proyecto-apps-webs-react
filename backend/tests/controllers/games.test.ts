import { test, after, beforeEach, describe } from "node:test";
import mongoose from "mongoose";
import assert from "node:assert";
import GameModel from "../../src/models/game";
import supertest from "supertest";
import app from "../../src/server";
import games from "../../db.json";
import User from "../../src/models/users";
import helper from "./test_utils";

const api = supertest(app);

let zeldaId: string;
let userId: string;
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
    userId = loginResponse.body.id;

    await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(games.games[0])
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    const tempGames = await helper.gamesInDb();
    zeldaId = tempGames[0].id;

    await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(games.games[1])
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("games are returned as json", async () => {
    await api
      .get("/api/games")
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("all games are returned", async () => {
    const response = await api
      .get("/api/games")
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(response.body.length, games.length);
  });

  test("a specific game is returned", async () => {
    const response = await api
    .get(`/api/games/${zeldaId}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      response.body.name,
      "The Legend of Zelda: Ocarina of Time"
    );
  });

  test("a user can add a game", async () => {
    const newGame = {
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    const testGame = games.find((g) => g.name === newGame.name);

    assert.strictEqual(games.length, 3);
    assert.strictEqual(testGame?.rating, 0);
    assert.deepStrictEqual(testGame?.reviews, []);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    const gameAdded = gamesAdded?.find((g) => g.toString() === testGame.id)
    assert.strictEqual(gamesAdded?.length, 3);
    assert(gameAdded);
  });

  test("a user not authenticated can't add a game", async () => {
    const newGame = {
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    await api
      .post("/api/games")
      .send(newGame)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);
  });

  test("a game without name can't be added", async () => {
    const newGame = {
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("a game without release_year can't be added", async () => {
    const newGame = {
      name: "Test Game",
      creator: "Test Creator",
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("a game without genre can't be added", async () => {
    const newGame = {
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("a game without image can't be added", async () => {
    const newGame = {
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Acción"],
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("a game without description can't be added", async () => {
    const newGame = {
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("a game without creator can be added", async () => {
    const newGame = {
      name: "Test Game",
      release_year: 2023,
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    const testGame = games.find((g) => g.name === newGame.name);

    assert.strictEqual(games.length, 3);
    assert.strictEqual(testGame?.creator, "Desconocido");
    assert.strictEqual(testGame?.rating, 0);
    assert.deepStrictEqual(testGame?.reviews, []);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    const gameAdded = gamesAdded?.find((g) => g.toString() === testGame.id)
    assert.strictEqual(gamesAdded?.length, 3);
    assert(gameAdded);
  });

  test("a game with name in the incorrect format can't be added", async () => {
    const newGame = {
      name: 2025,
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("a game with release_year in the incorrect format can't be added", async () => {
    const newGame = {
      name: "Test Game",
      release_year: "2025",
      creator: "Test Creator",
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("a game with genre in the incorrect format can't be added", async () => {
    const newGame = {
      name: "Test Game",
      release_year: 2023,
      genre: ["test"],
      creator: "Test Creator",
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("a game with image in the incorrect format can't be added", async () => {
    const newGame = {
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Acción"],
      image: "https://example.mp4",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("a game with description in the incorrect format can't be added", async () => {
    const newGame = {
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
      description: "          ",
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("a game with creator in the incorrect format can't be added", async () => {
    const newGame = {
      name: "Test Game",
      release_year: 2023,
      creator: 2023,
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const games = await helper.gamesInDb();
    assert.strictEqual(games.length, 2);

    const user = await helper.userInDbById(userId);
    const gamesAdded = user?.added;
    assert.strictEqual(gamesAdded?.length, 2);
    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));
  });

  test("add a game with invalid CSRF token can't be added", async () => {
    const newGame = {
      id: "",
      name: "Test Game",
      release_year: 2023,
      creator: "Test Creator",
      genre: ["Acción"],
      image: "http://example.com/image.jpg",
      description: "Juego para testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear, testear"
    };
    const response = await api
      .post("/api/games")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", "invalid-csrf-token")
      .send(newGame)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "invalid token");
    // Verificamos que no se agregó el juego
    const getResponse = await api.get("/api/games");
    assert.strictEqual(getResponse.body.length, 2);
  });

  test("set year of a specific game", async () => {
    const updatedGame = {
      release_year: 2025,
    };
    await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const year = game?.release_year;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(year, updatedGame.release_year);
  });

  test("set name of a specific game", async () => {
    const updatedGame = {
      name: " La leyenda de zelda: Ocarina of Time     ",
    };
    await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const year = game?.release_year;

    assert.strictEqual(title, "La leyenda de zelda: Ocarina of Time");
    assert.strictEqual(year, 1998);
  });

  test("set creator of a specific game", async () => {
    const updatedGame = {
      creator: " Nintendo de Japon     ",
    };
    await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const creator = game?.creator;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(creator, "Nintendo de Japon");
  });

  test("set genre of a specific game", async () => {
    const updatedGame = {
      genre: ["Mundo Abierto"],
    };
    await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const genre = game?.genre;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.deepStrictEqual(genre, ["Mundo Abierto"]);
  });

  test("set image of a specific game", async () => {
    const updatedGame = {
      image: " https://example.png     ",
    };
    await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const image = game?.image;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(image, "https://example.png");
  });

  test("set description of a specific game", async () => {
    const updatedGame = {
      description: " Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego     ",
    };
    await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const description = game?.description;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(description, "Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego");
  });

  test("set multiples fields of a specific game", async () => {
    const updatedGame = {
      release_year: 2006,
      image: "      https://example.png",
      description: " Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego     ",
    };
    await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const year = game?.release_year;
    const image = game?.image;
    const description = game?.description;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(year, 2006);
    assert.strictEqual(image, "https://example.png");
    assert.strictEqual(description, "Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego Buen juego");
  });

  test("set a specific game requires authentication", async () => {
    const updatedGame = {
      release_year: 2025
    };

    // Sin autenticación debe fallar
    const responseWithoutAuth = await api
      .put(`/api/games/${zeldaId}`)
      .send(updatedGame)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(responseWithoutAuth.body.error, "missing token");

    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const year = game?.release_year;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(year, 1998);
  });

  test("set a specific game fails with invalid CSRF token", async () => {
    const updatedGame = {
      release_year: 2025
    };

    // Con cookie pero CSRF token inválido
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", "invalid-csrf-token")
      .send(updatedGame)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "invalid token");

    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const year = game?.release_year;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(year, 1998);
  });

  test("set a specific game fails with invalid id", async () => {
    const updatedGame = {
      release_year: 2025
    };

    // Con cookie pero CSRF token inválido
    await api
      .put(`/api/games/1`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", "invalid-csrf-token")
      .send(updatedGame)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const year = game?.release_year;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(year, 1998);
  });

  test("set a specific game fails with invalid name format", async () => {
    const updatedGame = {
      name: 2025,
    };
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const year = game?.release_year;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(year, 1998);
    assert(response.body.error.includes("Los datos enviados no son del tipo correcto"));
  });

  test("set a specific game fails with invalid release_year format", async () => {
    const updatedGame = {
      release_year: "2025",
    };
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const year = game?.release_year;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(year, 1998);
    assert(response.body.error.includes("Los datos enviados no son del tipo correcto"));
  });

  test("set a specific game fails with invalid creator format", async () => {
    const updatedGame = {
      creator: "        ",
    };
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const creator = game?.creator;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(creator, "Nintendo");
    assert(response.body.error.includes("Los datos enviados no son del tipo correcto"));
  });

  test("set a specific game fails with invalid genre format", async () => {
    const updatedGame = {
      genre: ["Acción", "Acción"],
    };
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const genre = game?.genre;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.deepStrictEqual(genre, ["Acción", "Aventura", "RPG"]);
    assert(response.body.error.includes("Los datos enviados no son del tipo correcto"));
  });

  test("set a specific game fails with invalid image format", async () => {
    const updatedGame = {
      image: "https://example.jpgpng",
    };
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const image = game?.image;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(image, "https://www.vgfacts.com/media/boxart/1/25.png");
    assert(response.body.error.includes("Los datos enviados no son del tipo correcto"));
  });

  test("set a specific game fails with invalid description format", async () => {
    const updatedGame = {
      description: "",
    };
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const description = game?.description;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(description, "Ocarina of Time presenta una aventura épica en el reino de Hyrule, donde el jugador acompaña a Link en un viaje que combina exploración, combates dinámicos y resolución de acertijos en mazmorras llenas de secretos. A lo largo de su travesía, se alterna entre distintas épocas para alterar el destino del mundo, enfrentándose a criaturas, descubriendo nuevas habilidades y utilizando la música como herramienta clave para avanzar.");
    assert(response.body.error.includes("Al menos un campo es requerido"));
  });

  test("set a specific game with rating is not allow", async () => {
    const updatedGame = {
      name: "test",
      rating: 2,
    };
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const rating = game?.rating;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.strictEqual(rating, 0);
    assert(response.body.error.includes("No es posible cambiar estos campos"));
  });

  test("set a specific game with reviews is not allow", async () => {
    const updatedGame = {
      name: "test",
      reviews: ["Juego malo"],
    };
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const reviews = game?.reviews;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.deepStrictEqual(reviews, []);
    assert(response.body.error.includes("No es posible cambiar estos campos"));
  });

  test("set a specific game fails with none field", async () => {
    const updatedGame = {};
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(updatedGame)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert(response.body.error.includes("Al menos un campo es requerido"));
  });

  test("a user can't set a specific game if this didn't add it", async () => {
    await api.post("/api/register").send({
      username: "testuser2",
      name: "Test User 2",
      password: "password1234",
    });
    const loginResponse2 = await api.post("/api/login").send({
      username: "testuser2",
      password: "password1234",
    });
    const cookies2 = loginResponse2.headers["set-cookie"];
    const authCookie2 = cookies2[0];
    const csrfToken2 = loginResponse2.headers["x-csrf-token"];

    const updatedGame = {
      genre: ["Mundo Abierto"],
    };
    const response = await api
      .put(`/api/games/${zeldaId}`)
      .set("Cookie", authCookie2)
      .set("X-CSRF-Token", csrfToken2)
      .send(updatedGame)
      .expect(401)
      .expect("Content-Type", /application\/json/);
    
    const game = await helper.gameInDbById(zeldaId);
    const title = game?.name;
    const genre = game?.genre;

    assert.strictEqual(title, "The Legend of Zelda: Ocarina of Time");
    assert.deepStrictEqual(genre, ["Acción", "Aventura", "RPG"]);
    assert(response.body.error.includes("Solo un usuario que haya agregado ese juego puede cambiar sus atributos"));
  });

  after(async () => {
    await mongoose.connection.close();
  });

});