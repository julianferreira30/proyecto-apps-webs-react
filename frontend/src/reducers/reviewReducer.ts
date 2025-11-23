import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import reviewsService from "../services/reviews";
import type { Review } from "../types/review";
import { getOneGame } from "./gameReducer";
import { restoreSession } from "./userReducer";

interface ReviewState {
    showReviewForm: boolean;
    loading: boolean;
    error: string | null;
};

const initialState: ReviewState = {
    showReviewForm: false,
    loading: false,
    error: null,
};

export const createNewReview = (data: Omit<Review, "id" | "author_name" | "author_profile_image">) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const review = await reviewsService.createReview(data)
            if (!review) {
                dispatch(setError("Error al intentar crear la review"));
            };
            dispatch(restoreSession());
            dispatch(getOneGame(review.game));
        } catch {
            dispatch(setError("Error al intentar crear la review"));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

const slice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        setShowReviewForm(state: ReviewState, action: PayloadAction<boolean>) {
            state.showReviewForm = action.payload;
        },
        setLoading(state: ReviewState, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state: ReviewState, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const { setShowReviewForm, setLoading, setError } = slice.actions;
export default slice.reducer;