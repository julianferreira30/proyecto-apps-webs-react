//import type { Review } from "./review";

export type GameData = {
    id: string;
    name: string;
    release_year: number;
    creator: string;
    genre: string[];
    image: string;
    description: string;
    rating: number;
    //reviews: Review[];
}