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

// app.use(
//   cors({
//     origin: process.env.APP_URL || "http://localhost:3000",
//     credentials: true,
//   }),
// );

const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
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
