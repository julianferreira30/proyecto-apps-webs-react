import axios from "axios";
import axiosSecure from "../utils/axiosSecure";
import type { GameData } from "../types/games";

/** 
 * Obtiene todos los juegos de la base de datos
 * 
 * @returns Array con todos los juegos de la base de datos donde cada uno de sus elementos se compone como el siguiente JSON:
 * {
 *    id: string,
 *    name: string,
 *    release_year: number,
 *    creator: string,
 *    genre: Array de strings, 
 *    image: string,
 *    description: string,
 *    rating: number,
 *    reviews: Array de ids que referencian a una review,
 * }
 */
const getAllGames = async () => {
  try {
    const response = await axios.get("/api/games");
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  };
};


/** 
 * Obtiene un juego específico de la base de datos
 * 
 * @param id string que referencia al id de un juego específico en la base de datos
 * @returns JSON con la información del juego en el siguiente formato:
 * {
 *    id: string,
 *    name: string,
 *    release_year: number,
 *    creator: string,
 *    genre: Array de strings, 
 *    image: string,
 *    description: string,
 *    rating: number,
 *    reviews: Array donde cada elemento se compone como
 *    {
 *        id: string,
 *        rating: number,
 *        content: string,
 *        author_name: string,
 *        author_profile_image: string,
 *        game: id que referencia al juego mismo,
 *    }
 * }
 */
const getGameById = async (id: string) => {
  try {
    const response = await axios.get(`/api/games/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  };
};


/** 
 * Añade un nuevo juego a la base de datos solo si el usuario esta autenticado y si el input cumple que:
 * 1.- name es un string que tiene entre 1 a 100 caracteres.
 * 2.- release_year es un número entre 1972 y el año actual.
 * 3.- genre es un array sin repetidos con al menos un string de las siguientes posibilidades: "Acción", "Aventura", "Battle Royale", "Carrrera", "Ciencia Ficción",
 * "Deportes", "Estrategia", "Fantasia", "Indie", "Metroidvania", "MOBA", "Multiplayer", "Mundo Abierto", "Party Game", "Peleas", "Plataforma", 
 * "Rogue Like", "RPG", "Sandbox", "Shooter", "Sigilo", "Simulador", "Souls Like", "Superheroes", "Survival", "Tactical", "Team-Based", "Terror".
 * 4.- image es un string que contiene la cadena 'http://' o 'https://' al inicio, termina con '.png' o '.jpg' o '.jpeg' o '.gif' o '.bmp' o '.webp' o '.svg' 
 * y tiene un largo de entre 10 a 300 caracteres.
 * 5.- description es un string que tiene entre 10 a 300 caracteres.
 * 6.- creator puede ser undefined o un string que tiene entre 1 a 100 caracteres.
 * 
 * @param newObject JSON con la información del nuevo juego en el siguiente formato:
 * {
 *    name: string,
 *    release_year: number,
 *    creator: string,
 *    genre: Array de strings, 
 *    image: string,
 *    description: string,
 * }
 * @returns JSON con la información del juego recién agregado en el siguiente formato:
 * {
 *    id: string,
 *    name: string,
 *    release_year: number,
 *    creator: string,
 *    genre: Array de strings, 
 *    image: string,
 *    description: string,
 *    rating: number,
 *    reviews: Array de ids que referencian a una review,
 * }
 */
const createGame = async (newObject: Omit<GameData, "id" | "rating" | "reviews">) => {
  try {
    const response = await axiosSecure.post("/api/games", newObject)
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  };
};


/** 
 * Setea un juego de la base de datos con nueva información solo si el usuario esta autenticado, si el juego fue agregado a la base de datos por este mismo 
 * y si el input cumple que al menos uno los campos no es undefined, en el caso de no serlo, este campo debe cumplir que:
 * 1.- para el caso de name, debe ser un string que tiene entre 1 a 100 caracteres.
 * 2.- para el caso de release_year, debe ser un número entre 1972 y el año actual.
 * 3.- para el caso de genre, debe ser un array sin repetidos con al menos un string de las siguientes posibilidades: "Acción", "Aventura", "Battle Royale", "Carrrera", "Ciencia Ficción",
 * "Deportes", "Estrategia", "Fantasia", "Indie", "Metroidvania", "MOBA", "Multiplayer", "Mundo Abierto", "Party Game", "Peleas", "Plataforma", 
 * "Rogue Like", "RPG", "Sandbox", "Shooter", "Sigilo", "Simulador", "Souls Like", "Superheroes", "Survival", "Tactical", "Team-Based", "Terror".
 * 4.- para el caso de image, debe ser un string que contiene la cadena 'http://' o 'https://' al inicio, termina con '.png' o '.jpg' o '.jpeg' o '.gif' o '.bmp' o '.webp' o '.svg' 
 * y tiene un largo de entre 10 a 300 caracteres.
 * 5.- para el caso de description, debe ser un string que tiene entre 10 a 300 caracteres.
 * 6.- para el caso de creator, debe ser un string que tiene entre 1 a 100 caracteres.
 * 
 * @param newObject JSON con la información a setear en el siguiente formato:
 * {
 *    name: string,
 *    release_year: number,
 *    creator: string,
 *    genre: Array de strings, 
 *    image: string,
 *    description: string,
 * }
 * @param id string que referencia al id de un juego específico en la base de datos
 * @returns JSON con la información del juego recién seteado en el siguiente formato:
 * {
 *    id: string,
 *    name: string,
 *    release_year: number,
 *    creator: string,
 *    genre: Array de strings, 
 *    image: string,
 *    description: string,
 *    rating: number,
 *    reviews: Array de ids que referencian a una review,
 * }
 */
const setGame = async (newObject: Omit<GameData, "id" | "rating" | "reviews">, id: string) => {
  try {
    const response = await axiosSecure.put(`/api/games/${id}`, newObject)
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  };
};

export default { getAllGames, getGameById, createGame, setGame};