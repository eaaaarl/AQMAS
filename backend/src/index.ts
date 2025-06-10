import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import { serviceRoutes } from "./service/service.route";
import { configRoute } from "./config/config.route";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/api/user", serviceRoutes);
app.use("/api", configRoute);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
