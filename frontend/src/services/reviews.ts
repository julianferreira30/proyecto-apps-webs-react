import axiosSecure from "../utils/axiosSecure";
import type { Review } from "../types/review";


const createReview = async (review: Review) => {
    const response = await axiosSecure.post("/api/reviews", review);
    return response.data;
};

const getReviewsByGame = async (gameId: string) => {
    const response = await axiosSecure.get(`/api/game/${gameId}/reviews`);
    return response.data;
};

const getReviewsByUser = async (userId: string) => {
    const response = await axiosSecure.get(`/api/reviews/user/${userId}`);
    return response.data;
};

export default { createReview, getReviewsByGame, getReviewsByUser }
