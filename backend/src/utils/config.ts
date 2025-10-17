import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "my_secret";
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "localhost";

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

export default { PORT, MONGODB_URI, HOST, JWT_SECRET };
