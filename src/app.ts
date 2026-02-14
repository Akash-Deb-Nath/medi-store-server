import express, { Application } from "express";
import { medicinesRouter } from "./modules/medicines/medicines.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { categoriesRouter } from "./modules/categories/categories.router";
import { userRouter } from "./modules/user/user.router";
import { cartRouter } from "./modules/cart/cart.router";
import { ordersRouter } from "./modules/orders/orders.router";
import { reviewsRouter } from "./modules/reviews/reviews.router";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/categories", categoriesRouter);
app.use("/api/medicines", medicinesRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", ordersRouter);
app.use("/api/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
