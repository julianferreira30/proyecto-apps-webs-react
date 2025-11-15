import type { GameData } from "./games";
import type { Review } from "./review";

export interface User {
    id: string;
    profile_image: string;
    username: string;
    name: string;
    added:GameData[];
    played: GameData[];
    favorites: GameData[];
    wishlist: GameData[];
    reviews: Review[];
}