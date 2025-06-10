"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./infrastructure/express-server/app");
const database_1 = require("./infrastructure/database/database");
dotenv_1.default.config();
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        try {
            database_1.db.raw("SELECT 1");
            console.log("Database connected successfully!");
        }
        catch (error) {
            console.error("Failed to connect to the database \n", error);
            process.exit(1);
        }
        const app = (0, app_1.startApp)();
        const port = parseInt(process.env.PORT || "3003");
        app.listen(port, "0.0.0.0", () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start the server", error);
        process.exit(1);
    }
});
initializeServer();
