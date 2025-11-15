import axios from "axios";
import axiosSecure from "../utils/axiosSecure";

/**
 * Tipo que contiene los campos necesarios para iniciar sesión en la app por un usuario ya registrado
 */
type Credentials = {
    username: string;
    password: string;
};


/** 
 * Permite iniciar sesión en la página web
 * 
 * @remarks
 * 1.- username y password pueden tener varios espacios al inicio y final de la cadena, solo deben cumplir que al quitar esos espacios
 * los campos si existen para un usuario de la base de datos.
 * 2.- username puede contener letras en mayúsculas siempre y cuando en la misma posición del username real este la letra en minúscula
 * @param credentials JSON con la información necesaria para iniciar sesión:
 * {
 *    username: string,
 *    password: string
 * }
 * @returns JSON con la información del usuario logueado en el siguiente formato:
 * {
 *  id: string,
 *  profile_image: string,
 *  username: string,
 *  name: string,
 *  added: Array con el siguiente formato:
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
 * },
 *  played: Array con el siguiente formato:
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
 * },
 *  favorites: Array con el siguiente formato:
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
 * },
 *  wishlist: Array con el siguiente formato:
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
 * },
 *  reviews: Array donde cada elemento se compone como:
 * {
 *    id: string,
 *    rating: number,
 *    content: string,
 *    author_name: string,
 *    author_profile_image: string,
 *    game: id que referencia al juego mismo,
 * },
 * }
 */
const login = async (credentials: Credentials) => {
    const response = await axios.post("/api/login", credentials);

    const csrfToken = response.headers["x-csrf-token"];

    if (csrfToken) {
        localStorage.setItem("csrfToken", csrfToken);
    }

    return response.data;
};


/** 
 * Permite volver a obtener el usuario con sesión activa en la página web.
 * 
 * @returns JSON con la información del usuario que tiene una sesión activa en la página web:
 * {
 *  id: string,
 *  profile_image: string,
 *  username: string,
 *  name: string,
 *  added: Array con el siguiente formato:
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
 * },
 *  played: Array con el siguiente formato:
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
 * },
 *  favorites: Array con el siguiente formato:
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
 * },
 *  wishlist: Array con el siguiente formato:
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
 * },
 *  reviews: Array donde cada elemento se compone como:
 * {
 *    id: string,
 *    rating: number,
 *    content: string,
 *    author_name: string,
 *    author_profile_image: string,
 *    game: id que referencia al juego mismo,
 * },
 * }
 */
const restoreLogin = async () => {
    try {
        const response = await axiosSecure.get("/api/login/auth/me");
        return response.data; // Usuario logueado
    } catch {
        return null; // No logueado
    }
};

/**
 * Cierra la sesión de un usuario eliminando sus cookies
 */
const logout = async () => {
    await axios.post("/api/login/logout");
    localStorage.removeItem("csrfToken");
};

export default { login, restoreLogin, logout };