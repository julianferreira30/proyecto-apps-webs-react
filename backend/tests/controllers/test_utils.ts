import GameModel from "../../src/models/game";
import User from "../../src/models/users";
import ReviewModel from "../../src/models/review";

const userInDbById = async (id: string) => {
  const user = await User.findById(id);
  return user?.toJSON();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const gamesInDb = async () => {
  const games = await GameModel.find({});
  return games.map((game) => game.toJSON());
};

const gameInDbById = async (id: string) => {
  const game = await GameModel.findById(id);
  return game?.toJSON();
};

const reviewsInDb = async () => {
  const reviews = await ReviewModel.find({});
  return reviews.map((review) => review.toJSON());
};

const reviewInDbById = async (id: string) => {
  const review = await ReviewModel.findById(id);
  return review?.toJSON();
};

export default { userInDbById, usersInDb, gamesInDb, gameInDbById, reviewsInDb, reviewInDbById };