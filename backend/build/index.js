"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./utils/config"));
const logger_1 = __importDefault(require("./utils/logger"));
const server_1 = __importDefault(require("./server"));
dotenv_1.default.config();
server_1.default.listen(Number(config_1.default.PORT), config_1.default.HOST, () => {
    logger_1.default.info(`Server running on port ${config_1.default.PORT}`);
});
