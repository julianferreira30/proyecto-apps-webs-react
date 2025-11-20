import { useEffect } from "react";
import GameFilter from "../components/GameFilter";
import Games from "../components/Games";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { getGames } from "../reducers/gameReducer";
import { restoreSession } from "../reducers/userReducer";

const Root = () => {{
    // Store
    const dispatch = useDispatch<AppDispatch>();
    const games = useSelector((state: RootState) => state.games.games)


    // Carga recursos
    useEffect(() => {
        dispatch(getGames());
        dispatch(restoreSession());
    }, []);

    return (
        <div className="games-root">
            <div className="games-root-2">
              {games.length > 0 && <div className="game-filter"><GameFilter /></div>}
              <Games />
            </div>
        </div>
    )
}}

export default Root;