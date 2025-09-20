import axios from "axios";
const baseUrl = "http://localhost:3001/games";


const getAllGames = () => {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
}

export default getAllGames;