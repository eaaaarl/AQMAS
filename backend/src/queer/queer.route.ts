import express from "express";
import { queerController } from "./queer.config";

const router = express.Router();

router.get("/service", queerController.getQueerService);

export const queerRoutes = router;
