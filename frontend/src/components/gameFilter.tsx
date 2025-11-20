import { Button, List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store"; 
import type { Filter } from "../reducers/filterReducer";
import { setFilters, setOpenDropdown } from "../reducers/filterReducer";
import { setFilteredGames } from "../reducers/gameReducer";


/**
 * Componente que permite filtrar los juegos que se muestren según las categorías seleccionadas.
 * 
 * @component
 * @remarks
 * - Las opciones de cada categoría del filtro son opciones presentes por lo menos en un juego.
 * 
 * @returns filtro.
 */
const GameFilter = () => {
    // Store
    const dispatch = useDispatch<AppDispatch>();
    const openDropdown = useSelector((state: RootState) => state.filters.openDropdown);
    const filters = useSelector((state: RootState) => state.filters.filters);
    const games = useSelector((state: RootState) => state.games.games);

    // Selección de algún filtro
    const handleSelect = (key: keyof Filter, value: Filter[keyof Filter]) => {
        const newFilters = { ...filters, [key]: value };
        dispatch(setFilters(newFilters));
        let newFiltered = games.filter((game) =>
        (newFilters.year === null || game.release_year === newFilters.year) &&
        (newFilters.genre === null || game.genre.includes(newFilters.genre)) &&
        (newFilters.creator === null || game.creator.includes(newFilters.creator)) &&
        (newFilters.rating === null || game.rating === newFilters.rating)
        );

        if (newFilters.order != null) {
            switch (newFilters.order) {
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
                    newFiltered = [...newFiltered].sort((a, b) => a.release_year - b.release_year);
                    break;
                case "Año más reciente":
                    newFiltered = [...newFiltered].sort((a, b) => b.release_year - a.release_year);
                    break;
                case "Más reviews":
                    newFiltered = [...newFiltered].sort((a, b) => b.reviews.length - a.reviews.length);
                    break;
                case "Menos reviews":
                    newFiltered = [...newFiltered].sort((a, b) => a.reviews.length - b.reviews.length);
                    break;
                default:
                    break;
            }
        }
        dispatch(setFilteredGames(newFiltered));
        dispatch(setOpenDropdown(null));
    };

    // Opciones disponibles para las categorías del filtro
    const years = Array.from(new Set(games.map((g) => g.release_year))).sort((a,b) => b-a);
    const genres = Array.from(new Set(games.flatMap(g => g.genre)));
    const creators = Array.from(new Set(games.flatMap(g => g.creator || [])));
    const ratings = Array.from(new Set(games.map(g => g.rating))).sort((a,b) => a-b);

    // Renderiza el filtro con cada opción disponible
    const renderDropdown = (label: string, key: keyof Filter, options: Exclude<Filter[keyof Filter], null>[]) => (
        <div className="game-filter-dropdown">
            <Button
                variant="outlined"
                onClick={() => dispatch(setOpenDropdown(key))}
                className={openDropdown === key ? "game-filter-dropdown-button selected" : "game-filter-dropdown-button"}
            >
                {key === "order" && "Ordernar por: "}{filters[key] ? (filters[key].toString().length > 15 ? filters[key].toString().slice(0, 15).concat("...") : filters[key]) : (key === "order" ? "Añadido más reciente" : label)}
                {openDropdown === key ? <ExpandLess sx={{fontSize: "2vw"}}/> : <ExpandMore sx={{fontSize: "2vw"}}/>}
            </Button>

            <Collapse
                in={openDropdown === key}
                timeout="auto"
                unmountOnExit
                className="game-filter-dropdown-collapse"
            >
                <List component="div" disablePadding>
                    <ListItemButton onClick={() => handleSelect(key, null)} className={filters[key] === null ? "game-filter-options selected" : "game-filter-options"}>
                        <ListItemText primary={key === "order" ? "Añadido más reciente" : "Todos"}/>
                    </ListItemButton>
                    {options.map((option, i) => (
                        <ListItemButton key={i} onClick={() => handleSelect(key, option)} className={filters[key] === option ? "game-filter-options selected" : "game-filter-options"}>
                            <ListItemText primary={option.toString().length > 22 ? option.toString().slice(0, 22) : option.toString()}/>
                        </ListItemButton>
                    ))}
                </List>
            </Collapse>
        </div>
    );

    return (
        <div className="game-filter-container">
            <h3 className="game-filter-title">Juegos</h3>
            <div className="game-filter-container-dropdown">
            {renderDropdown("Año", "year", years)}
            {renderDropdown("Género", "genre", genres)}
            {renderDropdown("Creador", "creator", creators)}
            {renderDropdown("Calificación", "rating", ratings)}
            {renderDropdown("Ordenar por", "order", [
                "Añadido más antiguo",
                "Mayor calificación",
                "Menor calificación",
                "Año más reciente",
                "Año menos reciente",
                "Más reviews",
                "Menos reviews"
            ])}
            </div>
        </div>
    );
};

export default GameFilter;