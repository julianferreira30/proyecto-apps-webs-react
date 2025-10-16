import { useState } from "react";
import Button from "@mui/material/Button";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface FilterProps {
    years: number[];
    genres: string[];
    platforms: string[];
    ratings: number[];
    onFilterChange: (filters: FilterState) => void;
}

export type FilterState = {
    year: number | null;
    genre: string | null;
    platform: string | null;
    rating: number | null;
}

const GameFilters = ({ years, genres, platforms, ratings, onFilterChange }: FilterProps) => {
    const [openDropdown , setOpenDropdown] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        year: null,
        genre: null,
        platform: null,
        rating: null,
    });

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    }

    const handleSelect = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
        setOpenDropdown(null);
    };

    const renderDropdown = (label: string, key: keyof FilterState, options: Exclude<FilterState[keyof FilterState], null>[]) => (
        <div style={{ position: "relative" }}>
            <Button
                variant="outlined"
                onClick={() => toggleDropdown(key)}
                style={{ color: "white", borderColor: "white" }}
            >
                {label}: {filters[key] ?? "Todos"}
                {openDropdown === key ? <ExpandLess /> : <ExpandMore />}
            </Button>

            <Collapse
                in={openDropdown === key}
                timeout="auto"
                unmountOnExit
                style={{ position: "absolute", zIndex: 10, backgroundColor: "#727272" }}
            >
                <List component="div" disablePadding>
                    <ListItemButton onClick={() => handleSelect(key, null)}>
                        <ListItemText primary="Todos" />
                    </ListItemButton>
                    {options.map((option, i) => (
                        <ListItemButton key={i} onClick={() => handleSelect(key, option)}>
                            <ListItemText primary={option.toString()} />
                        </ListItemButton>
                    ))}
                </List>
            </Collapse>
        </div>
    );

    return (
        <div style={{ display: "flex", gap: "1rem", padding: "0 2rem", marginTop: "90px", textAlign: "center",alignContent: "stretch",flexDirection: "row",justifyContent: "center",alignItems: "center"}}>
            <h3>Filtrar por:</h3>
            {renderDropdown("Año", "year", years)}
            {renderDropdown("Género", "genre", genres)}
            {renderDropdown("Plataforma", "platform", platforms)}
            {renderDropdown("Calificación", "rating", ratings)}
        </div>
    );
};

export default GameFilters;