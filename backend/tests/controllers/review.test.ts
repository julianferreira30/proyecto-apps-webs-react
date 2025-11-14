import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../src/server";
import User from "../../src/models/users";
import ReviewModel from "../../src/models/review";
import GameModel from "../../src/models/game";
import games from "../../db.json";
import helper from "./test_utils";

const api = supertest(app);

let zeldaId: string;
let userId: string;
let authCookie: string;
let csrfToken: string;

describe("Reviews API tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await ReviewModel.deleteMany({});
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

  test("create a new review", async () => {
    const newReview = {
      rating: 5,
      content: "Juego bueniiiiiiiisimo",
      gameId: zeldaId,
    };

    const response = await api
      .post("/api/reviews")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newReview)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.content, newReview.content);
    assert.strictEqual(response.body.rating, newReview.rating);

    const reviews = await helper.reviewsInDb();
    const contents = reviews.map((r: {content: string}) => r.content);
    assert.strictEqual(reviews.length, 1);
    assert(contents.includes("Juego bueniiiiiiiisimo"));

    const game = await helper.gameInDbById(zeldaId);
    const reviewsZelda = await helper.reviewInDbById(game?.reviews[0].toString() || "");
    assert.strictEqual(game?.reviews.length, 1);
    assert.strictEqual(reviewsZelda?.content, "Juego bueniiiiiiiisimo");

    const user = await helper.userInDbById(userId);
    const reviewsUser = await helper.reviewInDbById(user?.reviews[0].toString() || "");
    assert.strictEqual(user?.reviews.length, 1);
    assert.strictEqual(reviewsUser?.content, "Juego bueniiiiiiiisimo");

    const playedUser = user.played;
    assert.strictEqual(playedUser.length, 1);
    assert(playedUser.find((g) => g.toString() === zeldaId));
  });

  test("create a new review change the rating of a game", async () => {
    const newReview = {
      rating: 0.5,
      content: "Juego malo",
      gameId: zeldaId
    };

    const response = await api
      .post("/api/reviews")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newReview)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.content, newReview.content);
    assert.strictEqual(response.body.rating, newReview.rating);
    assert.strictEqual(response.body.author_name, "testuser");

    const reviews = await helper.reviewsInDb();
    const contents = reviews.map((r: {content: string}) => r.content);
    assert.strictEqual(reviews.length, 1);
    assert(contents.includes("Juego malo"));

    const game = await helper.gameInDbById(zeldaId);
    const reviewsZelda = await helper.reviewInDbById(game?.reviews[0].toString() || "");
    assert.strictEqual(game?.reviews.length, 1);
    assert.strictEqual(game?.rating, 0.5);
    assert.strictEqual(reviewsZelda?.content, "Juego malo");

    const user = await helper.userInDbById(userId);
    const reviewsUser = await helper.reviewInDbById(user?.reviews[0].toString() || "");
    assert.strictEqual(user?.reviews.length, 1);
    assert.strictEqual(reviewsUser?.content, "Juego malo");


    const newReview2 = {
      rating: 5,
      content: "Juego Bueno",
      gameId: zeldaId
    };

    const response2 = await api
      .post("/api/reviews")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newReview2)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response2.body.content, newReview2.content);
    assert.strictEqual(response2.body.rating, newReview2.rating);
    assert.strictEqual(response2.body.author_name, "testuser");

    const reviews2 = await helper.reviewsInDb();
    const contents2 = reviews2.map((r: {content: string}) => r.content);
    assert.strictEqual(reviews2.length, 2);
    assert(contents2.includes("Juego Bueno"));

    const game2 = await helper.gameInDbById(zeldaId);
    const reviewsZelda2 = await helper.reviewInDbById(game2?.reviews[0].toString() || "");
    assert.strictEqual(game2?.reviews.length, 2);
    assert.strictEqual(game2?.rating, 2.75);
    assert.strictEqual(reviewsZelda2?.content, "Juego Bueno");

    const user2 = await helper.userInDbById(userId);
    const reviewsUser2 = await helper.reviewInDbById(user2?.reviews[0].toString() || "");
    assert.strictEqual(user2?.reviews.length, 2);
    assert.strictEqual(reviewsUser2?.content, "Juego Bueno");
  });

  test("create a new review fails without user", async () => {
    const newReview = {
      rating: 0.5,
      content: "Juego malo",
      gameId: zeldaId
    };

    const response = await api
      .post("/api/reviews")
      .send(newReview)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const reviews = await helper.reviewsInDb();
    assert.strictEqual(reviews.length, 0);

    const game = await helper.gameInDbById(zeldaId);
    assert.strictEqual(game?.reviews.length, 0);

    const user = await helper.userInDbById(userId);
    assert.strictEqual(user?.reviews.length, 0);
  });

  test("create a new review fails without a valid id game", async () => {
    const newReview = {
      rating: 0.5,
      content: "Juego malo",
      gameId: 1
    };

    const response = await api
      .post("/api/reviews")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newReview)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const reviews = await helper.reviewsInDb();
    assert.strictEqual(reviews.length, 0);

    const game = await helper.gameInDbById(zeldaId);
    assert.strictEqual(game?.reviews.length, 0);

    const user = await helper.userInDbById(userId);
    assert.strictEqual(user?.reviews.length, 0);
  });
  

  test("create a new review fails with rating not in 0 to 5", async () => {
    const newReview = {
      rating: 10,
      content: "Juego Buenisimo",
      gameId: zeldaId
    };

    const response = await api
      .post("/api/reviews")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newReview)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));

    const reviews = await helper.reviewsInDb();
    assert.strictEqual(reviews.length, 0);

    const game = await helper.gameInDbById(zeldaId);
    assert.strictEqual(game?.reviews.length, 0);

    const user = await helper.userInDbById(userId);
    assert.strictEqual(user?.reviews.length, 0);
  });

  test("create a new review fails without content", async () => {
    const newReview = {
      rating: 10,
      content: "",
      gameId: zeldaId
    };

    const response = await api
      .post("/api/reviews")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newReview)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));

    const reviews = await helper.reviewsInDb();
    assert.strictEqual(reviews.length, 0);

    const game = await helper.gameInDbById(zeldaId);
    assert.strictEqual(game?.reviews.length, 0);

    const user = await helper.userInDbById(userId);
    assert.strictEqual(user?.reviews.length, 0);
  });

  test("create a new review fails with rating not a multiple of 0.5", async () => {
    const newReview = {
      rating: 0.3,
      content: "Juego Buenisimo",
      gameId: zeldaId
    };

    const response = await api
      .post("/api/reviews")
      .set("Cookie", authCookie)
      .set("X-CSRF-Token", csrfToken)
      .send(newReview)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("Faltan datos o no son del tipo correcto"));

    const reviews = await helper.reviewsInDb();
    assert.strictEqual(reviews.length, 0);

    const game = await helper.gameInDbById(zeldaId);
    assert.strictEqual(game?.reviews.length, 0);

    const user = await helper.userInDbById(userId);
    assert.strictEqual(user?.reviews.length, 0);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});