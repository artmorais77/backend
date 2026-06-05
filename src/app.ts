import express from "express";
import cors from "cors"
import { errorHandler } from "@/shared/middleware/error-handler.middleware";

export const app = express();

app.use(cors())
app.use(express.json());
app.use(errorHandler);
