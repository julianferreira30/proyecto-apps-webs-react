import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import gamesService from "../services/games";
import type { GameData } from "../types/games";

interface GamesState {
  games: GameData[];
  filteredGames: GameData[];
  selectedGame: GameData | null;
  loading: boolean;
  error: string | null;
}

const initialState: GamesState = {
  games: [],
  filteredGames: [],
  selectedGame: null,
  loading: false,
  error: null,
};

export const getGames = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const games = await gamesService.getAllGames();
      if (!games) {
        dispatch(setError("Error al intentar obtener los juegos"));
        return;
      }

      dispatch(setGames(games));
      return;
    } catch {
      dispatch(setError("Error al intentar obtener los juegos"));
      return;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getOneGame = (id: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const game = await gamesService.getGameById(id);
      if (!game) {
        throw new Error("No se encontró el juego");
      }

      dispatch(setSelectedGame(game));
    } catch {
      dispatch(setError("Error al intentar obtener el juego"));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const createNewGame = (
  data: Omit<GameData, "id" | "rating" | "reviews">
) => {
  return async (dispatch: AppDispatch) => {
    try {
      if (
        !data.name ||
        !data.release_year ||
        data.genre.length === 0 ||
        !data.image ||
        !data.description
      ) {
        dispatch(setError("Por favor complete todos los campos obligatorios*"));
        return;
      }
      if (data.description.length < 2) {
        dispatch(setError("La descripción debe tener al menos 2 caracteres"));
        return;
      }
      const newGame: Omit<GameData, "id" | "rating" | "reviews"> = {
        name: data.name,
        release_year: Number(data.release_year),
        creator: data.creator,
        genre: data.genre,
        image: data.image,
        description: data.description,
      };
      const createdGame = await gamesService.createGame(newGame);
      if (!createdGame) {
        throw new Error("No se crear el juego");
      }
      dispatch(addGame(createdGame));
      return createdGame;
    } catch {
      dispatch(setError("Error al intentar crear el juego"));
      return;
    } finally {
      dispatch(setError(null));
      dispatch(setLoading(false));
    }
  };
};

export const updateOneGame = (
  data: Omit<GameData, "id" | "rating" | "reviews">,
  id: string
) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const game = await gamesService.setGame(data, id);
      if (!game) {
        throw new Error("No se actualizar el juego");
      }
      dispatch(updateGame(game));
      return game;
    } catch {
      dispatch(setError("Error al intentar actualizar el juego"));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

const slice = createSlice({
  name: "games",
  initialState,
  reducers: {
    setGames(state: GamesState, action: PayloadAction<GameData[]>) {
      state.games = action.payload;
    },
    setFilteredGames(state: GamesState, action: PayloadAction<GameData[]>) {
      state.filteredGames = action.payload;
    },
    setSelectedGame(state: GamesState, action: PayloadAction<GameData>) {
      state.selectedGame = action.payload;
    },
    addGame(state: GamesState, action: PayloadAction<GameData>) {
      state.games.push(action.payload);
    },
    updateGame(state: GamesState, action: PayloadAction<GameData>) {
      const index = state.games.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.games[index] = action.payload;
      }
      if (state.selectedGame?.id === action.payload.id) {
        state.selectedGame = action.payload;
      }
    },
    setLoading(state: GamesState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state: GamesState, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setGames,
  setFilteredGames,
  setSelectedGame,
  addGame,
  updateGame,
  setLoading,
  setError,
} = slice.actions;
export default slice.reducer;
