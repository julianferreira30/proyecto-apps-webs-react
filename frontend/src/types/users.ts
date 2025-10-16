import type { GameData } from "./games";
import type { Review } from "./review";

export interface User {
    id: string;
    username: string;
    image: string;
    reviews: Review[];
    favourites: GameData[];
    wishlist: GameData[];
}