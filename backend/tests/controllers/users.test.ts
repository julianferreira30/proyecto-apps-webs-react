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

describe("Users API tests", () => {
    beforeEach(async () => {
        await User.deleteMany({});

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

    test("A user can add a game to favorites", async () => {
        await api
        .post("/api/users/favorites")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200)

        const user = await helper.userInDbById(userId);
        const favorites = user?.favorites.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.favorites.length, 1);
        assert(favorites?.includes(zeldaId));
    });

    test("A user can't add a game to favorites without game id", async () => {
        const response = await api
        .post("/api/users/favorites")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({})
        .expect(400)

        const user = await helper.userInDbById(userId);
        assert.strictEqual(user?.favorites.length, 0);
        assert(response.body.error.includes("Faltan datos"));
    });

    test("A user can't add a game to favorites without verification", async () => {
        const response = await api
        .post("/api/users/favorites")
        .send({gameId: zeldaId})
        .expect(401)

        const user = await helper.userInDbById(userId);
        assert.strictEqual(user?.favorites.length, 0);
    });

    test("A user can't add a game to favorites with invalid game id", async () => {
        const response = await api
        .post("/api/users/favorites")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: "1"})
        .expect(500)

        const user = await helper.userInDbById(userId);
        assert.strictEqual(user?.favorites.length, 0);
    });

    test("A user can't add a game to favorites more than two times", async () => {
        await api
        .post("/api/users/favorites")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        await api
        .post("/api/users/favorites")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const favorites = user?.favorites.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.favorites.length, 1);
        assert(favorites?.includes(zeldaId));
    });

    test("A user can add a game to wishlist", async () => {
        await api
        .post("/api/users/wishlist")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200)

        const user = await helper.userInDbById(userId);
        const wishlist = user?.wishlist.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.wishlist.length, 1);
        assert(wishlist?.includes(zeldaId));
    });

    test("A user can't add a game to wishlist without game id", async () => {
        const response = await api
        .post("/api/users/wishlist")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({})
        .expect(400)

        const user = await helper.userInDbById(userId);
        assert.strictEqual(user?.wishlist.length, 0);
        assert(response.body.error.includes("Faltan datos"));
    });

    test("A user can't add a game to wishlist without verification", async () => {
        const response = await api
        .post("/api/users/wishlist")
        .send({gameId: zeldaId})
        .expect(401)

        const user = await helper.userInDbById(userId);
        assert.strictEqual(user?.wishlist.length, 0);
    });

    test("A user can't add a game to wishlist with invalid game id", async () => {
        const response = await api
        .post("/api/users/wishlist")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: "1"})
        .expect(500)

        const user = await helper.userInDbById(userId);
        assert.strictEqual(user?.wishlist.length, 0);
    });

    test("A user can't add a game to wishlist more than two times", async () => {
        await api
        .post("/api/users/wishlist")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        await api
        .post("/api/users/wishlist")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const wishlist = user?.wishlist.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.wishlist.length, 1);
        assert(wishlist?.includes(zeldaId));
    });

    test("A user can add a game to played", async () => {
        await api
        .post("/api/users/played")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200)

        const user = await helper.userInDbById(userId);
        const played = user?.played.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.played.length, 1);
        assert(played?.includes(zeldaId));
    });

    test("A user can't add a game to played without game id", async () => {
        const response = await api
        .post("/api/users/played")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({})
        .expect(400)

        const user = await helper.userInDbById(userId);
        assert.strictEqual(user?.played.length, 0);
        assert(response.body.error.includes("Faltan datos"));
    });

    test("A user can't add a game to played without verification", async () => {
        const response = await api
        .post("/api/users/played")
        .send({gameId: zeldaId})
        .expect(401)

        const user = await helper.userInDbById(userId);
        assert.strictEqual(user?.played.length, 0);
    });

    test("A user can't add a game to played with invalid game id", async () => {
        const response = await api
        .post("/api/users/played")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: "1"})
        .expect(500)

        const user = await helper.userInDbById(userId);
        assert.strictEqual(user?.played.length, 0);
    });

    test("A user can't add a game to played more than two times", async () => {
        await api
        .post("/api/users/played")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        await api
        .post("/api/users/played")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const played = user?.played.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.played.length, 1);
        assert(played?.includes(zeldaId));
    });

    test("A user can delete a game from favorites", async () => {
        await api
        .post("/api/users/favorites")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const favorites = user?.favorites.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.favorites.length, 1);
        assert(favorites?.includes(zeldaId));

        await api
        .delete(`/api/users/favorites/${zeldaId}`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(200)

        const updatedUser = await helper.userInDbById(userId);
        assert.strictEqual(updatedUser?.favorites.length, 0);
    });

    test("A user can't delete a game from favorites without game id", async () => {
        await api
        .post("/api/users/favorites")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const favorites = user?.favorites.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.favorites.length, 1);
        assert(favorites?.includes(zeldaId));

        const response = await api
        .delete(`/api/users/favorites/`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(404)

        const updatedUser = await helper.userInDbById(userId);
        const updatedfavorites = user?.favorites.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(updatedUser?.favorites.length, 1);
        assert(updatedfavorites?.includes(zeldaId));
    });

    test("A user can't delete a game from favorites without verification", async () => {
        await api
        .post("/api/users/favorites")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const favorites = user?.favorites.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.favorites.length, 1);
        assert(favorites?.includes(zeldaId));

        const response = await api
        .delete(`/api/users/favorites/${zeldaId}`)
        .expect(401)

        const updatedUser = await helper.userInDbById(userId);
        const updatedfavorites = user?.favorites.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(updatedUser?.favorites.length, 1);
        assert(updatedfavorites?.includes(zeldaId));
    });

    test("A user can't delete a game from favorites with invalid game id", async () => {
        await api
        .post("/api/users/favorites")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const favorites = user?.favorites.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.favorites.length, 1);
        assert(favorites?.includes(zeldaId));

        const response = await api
        .delete(`/api/users/favorites/1`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(500)

        const updatedUser = await helper.userInDbById(userId);
        const updatedfavorites = user?.favorites.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(updatedUser?.favorites.length, 1);
        assert(updatedfavorites?.includes(zeldaId));
    });

    test("A user can't delete a game from favorites more than two times", async () => {
        await api
        .post("/api/users/favorites")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const favorites = user?.favorites.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.favorites.length, 1);
        assert(favorites?.includes(zeldaId));

        await api
        .delete(`/api/users/favorites/${zeldaId}`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(200);

        const updatedUser1 = await helper.userInDbById(userId);
        assert.strictEqual(updatedUser1?.favorites.length, 0);

        await api
        .delete(`/api/users/favorites/${zeldaId}`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(200);

        const updatedUser2 = await helper.userInDbById(userId);
        assert.strictEqual(updatedUser2?.favorites.length, 0);
    });

    test("A user can delete a game from wishlist", async () => {
        await api
        .post("/api/users/wishlist")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const wishlist = user?.wishlist.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.wishlist.length, 1);
        assert(wishlist?.includes(zeldaId));

        await api
        .delete(`/api/users/wishlist/${zeldaId}`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(200)

        const updatedUser = await helper.userInDbById(userId);
        assert.strictEqual(updatedUser?.wishlist.length, 0);
    });

    test("A user can't delete a game from wishlist without game id", async () => {
        await api
        .post("/api/users/wishlist")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const wishlist = user?.wishlist.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.wishlist.length, 1);
        assert(wishlist?.includes(zeldaId));

        const response = await api
        .delete(`/api/users/wishlist/`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(404)

        const updatedUser = await helper.userInDbById(userId);
        const updatedWishlist = user?.wishlist.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(updatedUser?.wishlist.length, 1);
        assert(updatedWishlist?.includes(zeldaId));
    });

    test("A user can't delete a game from wishlist without verification", async () => {
        await api
        .post("/api/users/wishlist")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const wishlist = user?.wishlist.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.wishlist.length, 1);
        assert(wishlist?.includes(zeldaId));

        const response = await api
        .delete(`/api/users/wishlist/${zeldaId}`)
        .expect(401)

        const updatedUser = await helper.userInDbById(userId);
        const updatedWishlist = user?.wishlist.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(updatedUser?.wishlist.length, 1);
        assert(updatedWishlist?.includes(zeldaId));
    });

    test("A user can't delete a game from wishlist with invalid game id", async () => {
        await api
        .post("/api/users/wishlist")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const wishlist = user?.wishlist.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.wishlist.length, 1);
        assert(wishlist?.includes(zeldaId));

        const response = await api
        .delete(`/api/users/wishlist/1`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(500)

        const updatedUser = await helper.userInDbById(userId);
        const updatedWishlist = user?.wishlist.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(updatedUser?.wishlist.length, 1);
        assert(updatedWishlist?.includes(zeldaId));
    });

    test("A user can't delete a game from wishlist more than two times", async () => {
        await api
        .post("/api/users/wishlist")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const wishlist = user?.wishlist.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.wishlist.length, 1);
        assert(wishlist?.includes(zeldaId));

        await api
        .delete(`/api/users/wishlist/${zeldaId}`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(200);

        const updatedUser1 = await helper.userInDbById(userId);
        assert.strictEqual(updatedUser1?.wishlist.length, 0);

        await api
        .delete(`/api/users/wishlist/${zeldaId}`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(200);

        const updatedUser2 = await helper.userInDbById(userId);
        assert.strictEqual(updatedUser2?.wishlist.length, 0);
    });

    test("A user can delete a game from played", async () => {
        await api
        .post("/api/users/played")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const played = user?.played.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.played.length, 1);
        assert(played?.includes(zeldaId));

        await api
        .delete(`/api/users/played/${zeldaId}`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(200)

        const updatedUser = await helper.userInDbById(userId);
        assert.strictEqual(updatedUser?.played.length, 0);
    });

    test("A user can't delete a game from played without game id", async () => {
        await api
        .post("/api/users/played")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const played = user?.played.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.played.length, 1);
        assert(played?.includes(zeldaId));

        const response = await api
        .delete(`/api/users/played/`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(404)

        const updatedUser = await helper.userInDbById(userId);
        const updatedPlayed = user?.played.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(updatedUser?.played.length, 1);
        assert(updatedPlayed?.includes(zeldaId));
    });

    test("A user can't delete a game from played without verification", async () => {
        await api
        .post("/api/users/played")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const played = user?.played.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.played.length, 1);
        assert(played?.includes(zeldaId));

        const response = await api
        .delete(`/api/users/played/${zeldaId}`)
        .expect(401)

        const updatedUser = await helper.userInDbById(userId);
        const updatedPlayed = user?.played.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(updatedUser?.played.length, 1);
        assert(updatedPlayed?.includes(zeldaId));
    });

    test("A user can't delete a game from played with invalid game id", async () => {
        await api
        .post("/api/users/played")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const played = user?.played.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.played.length, 1);
        assert(played?.includes(zeldaId));

        const response = await api
        .delete(`/api/users/played/1`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(500)

        const updatedUser = await helper.userInDbById(userId);
        const updatedPlayed = user?.played.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(updatedUser?.played.length, 1);
        assert(updatedPlayed?.includes(zeldaId));
    });

    test("A user can't delete a game from played more than two times", async () => {
        await api
        .post("/api/users/played")
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .send({gameId: zeldaId})
        .expect(200);

        const user = await helper.userInDbById(userId);
        const played = user?.played.map((r: {_id: mongoose.Types.ObjectId}) => r._id.toString());
        assert.strictEqual(user?.played.length, 1);
        assert(played?.includes(zeldaId));

        await api
        .delete(`/api/users/played/${zeldaId}`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(200);

        const updatedUser1 = await helper.userInDbById(userId);
        assert.strictEqual(updatedUser1?.played.length, 0);

        await api
        .delete(`/api/users/played/${zeldaId}`)
        .set("Cookie", authCookie)
        .set("X-CSRF-Token", csrfToken)
        .expect(200);

        const updatedUser2 = await helper.userInDbById(userId);
        assert.strictEqual(updatedUser2?.played.length, 0);
    });

    after(async () => {
    await mongoose.connection.close();
  });
});