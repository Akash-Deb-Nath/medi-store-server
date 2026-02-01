import express, { Application } from "express";
import { medicinesRouter } from "./modules/medicines/medicines.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { categoriesRoute } from "./modules/categories/categories.router";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/medicines", medicinesRouter);
app.use("/categories", categoriesRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
