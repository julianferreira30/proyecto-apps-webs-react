import axios from "axios";
import axiosSecure from "../utils/axiosSecure";
import type { GameData } from "../types/games";


const getAllGames = () => {
    const request = axios.get("/api/games");
    return request.then((response) => response.data);
}

const getGameById = async (id: string) => {
    const response = axiosSecure.get(`/api/games/${id}`);
    return response.then((response) => response.data);
};

const createGame = async (newObject: Omit<GameData, "id" | "rating">) => {
  const request = axiosSecure.post("/api/games", newObject)
  return request.then((response) => response.data);
};

export default { getAllGames, getGameById, createGame};