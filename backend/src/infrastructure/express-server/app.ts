import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { serviceRoutes } from "../../service/service.route";
import { configRoute } from "../../config/config.route";

export const startApp = () => {
  const app = express();

  //Security Middleware
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  //Body Parser Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());

  //Core Routes
  app.use("/api/user", serviceRoutes);
  app.use("/api", configRoute);

  return app;
};
