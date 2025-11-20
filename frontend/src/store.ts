import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import gamesReducer from "./reducers/gameReducer";
import reviewsReducer from "./reducers/reviewReducer";
import filterReducer from "./reducers/filterReducer";

export const store = configureStore({
    reducer: {
        user: userReducer,
        games: gamesReducer,
        reviews: reviewsReducer,
        filters: filterReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;