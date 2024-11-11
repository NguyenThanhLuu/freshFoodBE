import { Router } from "express";
import {
  handleCreateNewToken,
  handleLogin,
  handleSignUp,
  updateUser,
} from "../controllers/users.controller";
import authMid from "../middlewares/auth.mid";
import adminValidateAuth from "../middlewares/admin-validate.auth";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/login", handleLogin);
router.post("/signUp", handleSignUp);
router.post("/newToken", handleCreateNewToken);

router.use(authMid);
router.use(adminValidateAuth);
router.patch("/update", upload.single("avatarFile"), updateUser);

export default router;
