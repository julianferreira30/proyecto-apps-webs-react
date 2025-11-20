import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/users";
import type { RegisterData } from "../services/register";
import type { Credentials } from "../services/login";
import type { AppDispatch } from "../store";
import registerService from "../services/register";
import loginService from "../services/login";
import userService from "../services/users";
import type { GameData } from "../types/games";
import type { Review } from "../types/review";

interface UserState {
    user: User | null;
    showLoginForm: boolean;
    show: GameData[] | Review[];
    loading: boolean;
    error: string | null;
};

const initialState: UserState = {
    user: null,
    showLoginForm: false,
    show: [],
    loading: false,
    error: null,
};

export const registerUser = (data: RegisterData) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            await registerService.register(data);
            const user = await loginService.login({username: data.username, password: data.password})
            if (!user) {
                throw new Error("No se pudo registrar el usuario");
            };

            dispatch(setUser(user));
        } catch {
            dispatch(setError("Error al registrar el usuario"));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const loginUser = (credentials: Credentials) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const user = await loginService.login(credentials);
            if (!user) {
                dispatch(setError("Error al iniciar sesión"));
                return false;
            }
            dispatch(setUser(user));
            return true;
        } catch {
            dispatch(setError("Error al iniciar sesión"));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const restoreSession = () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const user = await loginService.restoreLogin();
            if (user) {
                dispatch(setUser(user));
            } else {
                dispatch(setUser(null));
            };
        } catch {
            dispatch(setError(null));
            dispatch(setError("No se pudo restaurar la sesión"));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const logoutUser = () => {
    return async (dispatch: AppDispatch) => {
        await loginService.logout();
        dispatch(setUser(null));
    };
};

export const toggleFavourite = (gameId: string, user: User) => {
    return async (dispatch: AppDispatch) => {
        try {
            if (!user) {
                return;
            };

            let updatedFavourites;
            if (user.favorites.some((g) => g.id === gameId)) {
                updatedFavourites = await userService.removeFromFavorites(gameId);
            } else {
                updatedFavourites = await userService.addToFavorites(gameId);
            };

            if (updatedFavourites) {
                dispatch(setUser({...user, favorites: updatedFavourites}));
            } else {
                dispatch(setError("Error al eliminar el juego de favoritos"));
            };
        } catch {
            dispatch(setError("Error al eliminar el juego de favoritos"));
        }
    };
};

export const toggleWishlist = (gameId: string, user: User) => {
    return async (dispatch: AppDispatch) => {
        try {
            if (!user) {
                return;
            };

            let updatedWishlist;
            if (user.wishlist.some((g) => g.id === gameId)) {
                updatedWishlist = await userService.removeFromWishlist(gameId);
            } else {
                updatedWishlist = await userService.addToWishlist(gameId);
            };

            if (updatedWishlist) {
                dispatch(setUser({...user, wishlist: updatedWishlist}));
            } else {
                dispatch(setError("Error al eliminar el juego de la wishlist"));
            };
        } catch {
            dispatch(setError("Error al eliminar el juego de la wishlist"));
        }
    };
};

export const togglePlayed = (gameId: string, user: User) => {
    return async (dispatch: AppDispatch) => {
        try {
            if (!user) {
                return;
            };

            const reviewed = user.reviews.some((r) => r.game === gameId);

            let updatedPlayed;
            if (user.played.some((g) => g.id === gameId)) {
                if (reviewed) {
                    dispatch(setError("No se puede quitar de jugados porque ya hiciste una review"));
                    return;
                } else {
                    updatedPlayed = await userService.removeFromPlayed(gameId);
                }
            } else {
                updatedPlayed = await userService.addToPlayed(gameId);
            };

            if (updatedPlayed) {
                dispatch(setUser({...user, played: updatedPlayed}));
            } else {
                dispatch(setError("Error al eliminar de los juegos jugados"));
            };
        } catch {
            dispatch(setError("Error al eliminar de los juegos jugados"));
        }
    };
};

const slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state: UserState, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
        setShowLoginForm(state: UserState, action: PayloadAction<boolean>) {
            state.showLoginForm = action.payload;
        },
        setShow(state: UserState, action: PayloadAction<string>) {
            if (action.payload === "played") {
                state.show = state.user?.played || [];
            }
            if (action.payload === "favorites") {
                state.show = state.user?.favorites || [];
            }
            if (action.payload === "wishlist") {
                state.show = state.user?.wishlist || [];
            }
            if (action.payload === "reviews") {
                state.show = state.user?.reviews || [];
            }
        },
        setLoading(state: UserState, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state: UserState, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const { setUser, setShowLoginForm, setShow, setLoading, setError } = slice.actions;
export default slice.reducer;