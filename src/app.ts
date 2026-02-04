import express, { Application } from "express";
import { medicinesRouter } from "./modules/medicines/medicines.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { categoriesRouter } from "./modules/categories/categories.router";
import { userRouter } from "./modules/user/user.router";
import { cartRouter } from "./modules/cart/cart.router";

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
app.use("/categories", categoriesRouter);
app.use("/profile", userRouter);
app.use("/cart", cartRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
