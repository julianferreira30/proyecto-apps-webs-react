import axios from "axios";
import axiosSecure from "../utils/axiosSecure";


const getAllGames = () => {
    const request = axios.get("/api/games");
    return request.then((response) => response.data);
}

const getGameById = async (id: string) => {
    const response = await axiosSecure.get(`/api/games/${id}`);
    return response.data;
};

export default { getAllGames, getGameById};