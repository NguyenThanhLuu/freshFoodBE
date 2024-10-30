import { Router } from "express";
import {
  handleCreateNewToken,
  handleLogin,
  handleSignUp,
  updateUser,
} from "../controllers/users.controller";
import authMid from "../middlewares/auth.mid";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/login", handleLogin);
router.post("/signUp", handleSignUp);
router.post("/newToken", handleCreateNewToken);
router.use(authMid).patch("/update", upload.single("avatarFile"), updateUser);

export default router;
