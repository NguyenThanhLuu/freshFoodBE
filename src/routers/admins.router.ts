import { Router } from "express";
import multer from "multer";
import {
  addProduct,
  deleteProduct,
  getAllCustomerOrders,
  getAllOrdersFinished,
  updateOrderStatus,
  updateProduct,
} from "../controllers/admins.controller";
import auth from "../middlewares/auth.mid";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(auth);
router.post("/add", upload.single("image"), addProduct);
router.get("/orders", getAllCustomerOrders);
router.get("/ordersFinished/:time", getAllOrdersFinished);
router.patch("/update/:id", upload.single("image"), updateProduct);
router.patch("/order/:id", updateOrderStatus);
router.delete("/delete/:id", deleteProduct);

export default router;
