import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Filter = {
    year: number | null;
    genre: string | null;
    creator: string | null;
    rating: number | null;
    order: string | null;
}

interface FilterState {
    filters: Filter;
    openDropdown: string | null;
}

const initialState: FilterState = {
    filters: {
        year: null,
        genre: null,
        creator: null,
        rating: null,
        order: null,
    },
    openDropdown: null,
};

const slice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setOpenDropdown(state: FilterState, action: PayloadAction<string | null>) {
            state.openDropdown = state.openDropdown === action.payload ? null : action.payload;
        },
        setFilters(state: FilterState, action: PayloadAction<Filter>) {
            state.filters = action.payload;
        },
    },
});

export const { setOpenDropdown, setFilters } = slice.actions;
export default slice.reducer;