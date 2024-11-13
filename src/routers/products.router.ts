import { Router } from "express";
import {
  getProductDetail,
  getProducts,
  getTag,
  getTags,
  searchProduct,
} from "../controllers/products.controller";
import auth from "../middlewares/auth.mid";

const router = Router();
// router.use(auth);
router.get("/", getProducts);

router.get(
  "/seed"
  // asyncHandler(async (req, res) => {
  //   const productsCount = await UserModel.countDocuments();
  //   if (productsCount > 0) {
  //     res.send("Seed is already done!");
  //     return;
  //   }
  //   await UserModel.create(USERS);
  //   res.send("Seed Is Done!");
  // })

  // asyncHandler(async (req, res) => {
  //   const productsCount = await ProductModel.countDocuments();
  //   if (productsCount > 0) {
  //     res.send("Seed is already done!");
  //     return;
  //   }
  //   await ProductModel.create(PRODUCTS_DUMMY_DATA);
  //   res.send("Seed Is Done!");
  // })
);

router.get("/search/:searchKey", searchProduct);

router.get("/tag/:tagName", getTag);

router.get("/tags", getTags);

router.get("/:id", getProductDetail);

export default router;
