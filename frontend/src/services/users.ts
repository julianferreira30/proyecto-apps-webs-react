import axiosSecure from "../utils/axiosSecure";

const addToFavorites = async (gameId: string) => {
    const response = await axiosSecure.post("/api/users/favorites", { gameId });
    return response.data;
}

const addToWishlist = async (gameId: string) => {
    const response = await axiosSecure.post("/api/users/wishlist", { gameId });
    return response.data;
}

const removeFromFavorites = async (gameId: string) => {
    const response = await axiosSecure.delete(`/api/users/favorites/${gameId}`);
    return response.data;
}

const removeFromWishlist = async (gameId: string) => {
    const response = await axiosSecure.delete(`/api/users/wishlist/${gameId}`);
    return response.data;
}

export default { addToFavorites, addToWishlist, removeFromFavorites, removeFromWishlist }
