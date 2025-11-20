import dotenv from "dotenv";
import config from "./utils/config";
import logger from "./utils/logger";
import app from "./server";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

app.listen(Number(config.PORT), config.HOST, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
