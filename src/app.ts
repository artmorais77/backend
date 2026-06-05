import express from "express";
import { errorHandler } from "@/shared/middleware/error-handler.middleware";

export const app = express();

app.use(express.json());
app.use(errorHandler);
