import axiosSecure from "../utils/axiosSecure";


/**
 * Permite añadir un juego a la lista de favoritos de un usuario autenticado.
 * 
 * @param gameId string que referencia al id de un juego específico en la base de datos
 * @returns Array de los juegos favoritos de un usuario donde cada elemento tiene el formato:
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
const addToFavorites = async (gameId: string) => {
    try {
        const response = await axiosSecure.post("/api/users/favorites", { gameId });
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    };
};


/**
 * Permite añadir un juego a la wishlist de un usuario autenticado.
 * 
 * @param gameId string que referencia al id de un juego específico en la base de datos
 * @returns Array de los juegos en la wishlist de un usuario donde cada elemento tiene el formato:
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
const addToWishlist = async (gameId: string) => {
    try {
        const response = await axiosSecure.post("/api/users/wishlist", { gameId });
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    };
}


/**
 * Permite añadir un juego a la lista de jugados de un usuario autenticado.
 * 
 * @param gameId string que referencia al id de un juego específico en la base de datos
 * @returns Array de los juegos jugados de un usuario donde cada elemento tiene el formato:
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
const addToPlayed = async (gameId: string) => {
    try {
        const response = await axiosSecure.post("/api/users/played", { gameId });
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    };
}


/**
 * Permite eliminar un juego de la lista de favoritos de un usuario autenticado.
 * 
 * @param gameId string que referencia al id de un juego específico en la base de datos
 * @returns Array de los juegos favoritos de un usuario donde cada elemento tiene el formato:
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
const removeFromFavorites = async (gameId: string) => {
    try {
        const response = await axiosSecure.delete(`/api/users/favorites/${gameId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    };
}


/**
 * Permite eliminar un juego de la wishlist de un usuario autenticado.
 * 
 * @param gameId string que referencia al id de un juego específico en la base de datos
 * @returns Array de la wishlist de un usuario donde cada elemento tiene el formato:
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
const removeFromWishlist = async (gameId: string) => {
    try {
        const response = await axiosSecure.delete(`/api/users/wishlist/${gameId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    };
};


/**
 * Permite eliminar un juego de la lista de jugados de un usuario autenticado.
 * 
 * @param gameId string que referencia al id de un juego específico en la base de datos
 * @returns Array de los juegos jugados de un usuario donde cada elemento tiene el formato:
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
const removeFromPlayed = async (gameId: string) => {
    try {
        const response = await axiosSecure.delete(`/api/users/played/${gameId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    };
}

export default { addToFavorites, addToWishlist, addToPlayed, removeFromFavorites, removeFromWishlist, removeFromPlayed }
