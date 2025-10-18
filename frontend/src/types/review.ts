import type { User } from "./users";

export type Review = {
    id: string;
    rating: number;
    content: string;
    author: User;
}