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
import adminValidate from "../middlewares/admin-validate.auth";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(auth);
router.get("/ordersFinished/:time", getAllOrdersFinished);
router.get("/orders", getAllCustomerOrders);

router.use(adminValidate);
router.post("/add", upload.single("image"), addProduct);
router.patch("/update/:id", upload.single("image"), updateProduct);
router.patch("/order/:id", updateOrderStatus);
router.delete("/delete/:id", deleteProduct);

export default router;
