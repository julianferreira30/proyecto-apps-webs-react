import { useEffect } from "react";
import GameFilter from "../components/gameFilter";
import Games from "../components/Games";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { getGames, setFilteredGames } from "../reducers/gameReducer";
import { restoreSession } from "../reducers/userReducer";

const Root = () => {
  {
    // Store
    const dispatch = useDispatch<AppDispatch>();
    const games = useSelector((state: RootState) => state.games.games);

    // Carga recursos
    useEffect(() => {
      dispatch(getGames());
      dispatch(restoreSession());
    }, []);

    const filters = useSelector((state: RootState) => state.filters.filters);

    useEffect(() => {
      if (games.length === 0) return;

      let newFiltered = games.filter(
        (game) =>
          (filters.year === null || game.release_year === filters.year) &&
          (filters.genre === null || game.genre.includes(filters.genre)) &&
          (filters.creator === null ||
            game.creator.includes(filters.creator)) &&
          (filters.rating === null || game.rating === filters.rating)
      );

      if (filters.sort != null) {
        switch (filters.sort) {
          case "Añadido más antiguo":
            newFiltered = [...newFiltered].reverse();
            break;
          case "Mayor calificación":
            newFiltered = [...newFiltered].sort((a, b) => b.rating - a.rating);
            break;
          case "Menor calificación":
            newFiltered = [...newFiltered].sort((a, b) => a.rating - b.rating);
            break;
          case "Año menos reciente":
            newFiltered = [...newFiltered].sort(
              (a, b) => a.release_year - b.release_year
            );
            break;
          case "Año más reciente":
            newFiltered = [...newFiltered].sort(
              (a, b) => b.release_year - a.release_year
            );
            break;
          case "Más reviews":
            newFiltered = [...newFiltered].sort(
              (a, b) => b.reviews.length - a.reviews.length
            );
            break;
          case "Menos reviews":
            newFiltered = [...newFiltered].sort(
              (a, b) => a.reviews.length - b.reviews.length
            );
            break;
        }
      }

      dispatch(setFilteredGames(newFiltered));
    }, [games, filters]);

    return (
      <div className="games-root">
        <div className="games-root-2">
          {games.length > 0 && (
            <div className="game-filter">
              <GameFilter />
            </div>
          )}
          <Games />
        </div>
      </div>
    );
  }
};

export default Root;
