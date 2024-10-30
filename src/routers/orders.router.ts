import { Router } from "express";
import {
  createOrder,
  getYourOrders,
  updateOrder,
} from "../controllers/orders.controller";
import auth from "../middlewares/auth.mid";

const router = Router();
router.use(auth);
router.post("/update", updateOrder);
router.post("/create", createOrder);
router.get("/yourOrders", getYourOrders);

export default router;
