import axiosSecure from "../utils/axiosSecure";
import type { Review } from "../types/review";


/**
 * Permite a un usuario autenticado crear una review sobre un juego para almacenarla en la base de datos. El input debe cumplir que:
 * 1.- rating debe ser un número entre 0 y 5 múltiplo de 0.5
 * 2.- content debe ser un string entre 1 a 1000 caracteres
 * 3.- game debe ser un id real de la base de datos perteneciente a un juego
 * 
 * @param review JSON con la información necesaria para crear una review:
 * {
 *   rating: number
 *   content: string
 *   game: string
 * }
 * @returns JSON con información de la review recién creada en el siguiente formato:
 * {
 *   id: string,
 *   rating: number,
 *   content: string,
 *   author_name: string,
 *   author_profile_image: string,
 *   game: id que referencia al juego que se hizo la review,
 * }
 */
const createReview = async (review: Omit<Review, "id" | "author_name" | "author_profile_image">) => {
    try {
        const response = await axiosSecure.post("/api/reviews", review);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default { createReview }
