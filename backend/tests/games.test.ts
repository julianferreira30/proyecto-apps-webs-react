import { test, after, beforeEach, describe} from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import GameModel from "../src/models/game";
import supertest from "supertest";
import app from "../src/app";
import games from "../db.json";


const api = supertest(app);

interface GameJson {
    id: string;
    name: string;
    release_year: number;
    creator: string;
    genre: string[]; 
    image: string;
}

let zeldaId: string;
describe("GameBoxd API integration tests", () => {
    beforeEach(async () => {
        await GameModel.deleteMany({});
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
        assert.strictEqual(response.body.name, "The Legend of Zelda: Ocarina of Time");
    });

    test("POST /api/games", async () => {
        const newGame: GameJson = {
            id: "",
            name: "Test Game",
            release_year: 2023,
            creator: "Test Creator",
            genre: ["Test Genre"],
            image: "http://example.com/image.jpg"
        };
        const response = await api.post("/api/games").send(newGame);
        assert.strictEqual(response.status, 201);
        assert.strictEqual(response.body.name, newGame.name);

        const getResponse = await api.get("/api/games");
        assert.strictEqual(getResponse.body.length, 3);
    });

    test("PUT /api/games/:id", async () => {
        const updatedGame: Partial<GameJson> = {
            release_year: 2025
        };
        const response = await api.patch(`/api/games/${zeldaId}`).send(updatedGame);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.release_year, updatedGame.release_year);
        assert.strictEqual(response.body.name, "The Legend of Zelda: Ocarina of Time");
    });

    test("DELETE /api/games/:id", async () => {
        const response = await api.delete(`/api/games/${zeldaId}`);
        assert.strictEqual(response.status, 204);

        const getResponse = await api.get("/api/games");
        assert.strictEqual(getResponse.body.length, 1);
    });
    
    after(async () => {
        await mongoose.connection.close();
    });
});