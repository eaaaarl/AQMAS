import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { queerRoutes } from "./queer/queer.route";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/queer", queerRoutes);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://192.168.56.1:3000");
});
