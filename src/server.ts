import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { dbConnect } from "./configs/database.config";
import adminRouter from "./routers/admins.router";
import ordersRouter from "./routers/orders.router";
import productsRouter from "./routers/products.router";
import usersRouter from "./routers/users.router";
dotenv.config();
dbConnect();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/test", (req, res) => {
  res.send({ message: "test successful" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server working!");
});
