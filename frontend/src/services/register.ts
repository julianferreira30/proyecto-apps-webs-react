import axios from "axios";

export type RegisterData = {
    profile_image: string;
    username: string;
    name: string;
    password: string;
};


/**
 * Permite crear un usuario en la base de datos solo si el input cumple que:
 * 1.- profile_image es undefined o un string que contiene la cadena 'http://' o 'https://' al inicio, termina con la cadena 
 * '.png' o '.jpg' o '.jpeg' o '.gif' o '.bmp' o '.webp' o '.svg' y tiene un largo de entre 10 a 300 caracteres.
 * 2.- username es un string que tiene entre 5 a 30 caracteres
 * 3.- name es un string que tiene entre 1 a 50 caracteres
 * 4.- password es un string que tiene entre 8 a 30 caracteres
 * 
 * @remarks username en la base de datos se guarda sin espacios al inicio y final de la cadena y con todas las letras en minúsculas.
 * @param data JSON con la información necesaria para crear un usuario en la base de datos:
 * {
 *    profile_image: string
 *    username: string,
 *    name: string,
 *    password: string
 * }
 * @returns JSON con la información del usuario ya creado:
 * {
 *  id: string,
 *  profile_image: string,
 *  username: string,
 *  name: string,
 *  added: Array vacío de ids de juegos,
 *  played: Array vacío de ids de juegos,
 *  favorites: Array vacío de ids de juegos,
 *  wishlist: Array vacío de ids de juegos,
 *  reviews: Array vacío de ids de reviews,
 * }
 */
const register = async (data: RegisterData) => {
    try {
        const response = await axios.post("/api/register", data);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    };
};

export default { register };