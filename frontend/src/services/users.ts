import axiosSecure from "../utils/axiosSecure";

const addToFavorites = async (gameId: string) => {
    const response = await axiosSecure.post("/api/users/favorites", { gameId });
    return response.data.favourites;
}

const addToWishlist = async (gameId: string) => {
    const response = await axiosSecure.post("/api/users/wishlist", { gameId });
    return response.data.wishlist;
}

const removeFromFavorites = async (gameId: string) => {
    const response = await axiosSecure.delete(`/api/users/favorites/${gameId}`);
    return response.data.favourites;
}

const removeFromWishlist = async (gameId: string) => {
    const response = await axiosSecure.delete(`/api/users/wishlist/${gameId}`);
    return response.data.wishlist;
}

export default { addToFavorites, addToWishlist, removeFromFavorites, removeFromWishlist }
