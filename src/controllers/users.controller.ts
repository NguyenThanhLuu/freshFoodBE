import bcrypt from "bcryptjs";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
import { REFRESH_TOKEN_EXPIRED } from "../constants/error-message";
import {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_UNAUTHORIZED,
} from "../constants/http_status";
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from "../constants/token-time";
import { UserModel } from "../models/users.model";
import supabase, { SUPABASE_URL } from "../services/supabase";

export const handleLogin = async (req: any, res: any) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const isValidPassword = await bcrypt.compare(password, user?.password || "");
  if (user && isValidPassword) {
    res.send(getToken(user));
  } else {
    res
      .status(HTTP_BAD_REQUEST)
      .send("Login failed invalid email or password!");
  }
};

export const handleSignUp = async (req: any, res: any) => {
  const { email, username, password } = req.body;
  const isExistedUser = await UserModel.findOne({ email });
  if (isExistedUser) {
    res.status(HTTP_BAD_REQUEST).send("User is already exist, please login!");
    return;
  }
  const encryptedPassword = await bcrypt.hash(password, 10);

  const createdUser = await UserModel.create({
    username,
    role: "user",
    email,
    password: encryptedPassword,
  });
  res.send(getToken(createdUser));
};

function getToken(user: any) {
  const id = user._id;
  const refresh_token = createToken(
    user,
    process.env.REFESH_SECRET_KEY as string,
    REFRESH_TOKEN_TIME
  );
  const access_token = createToken(
    user,
    process.env.ACCESS_SECRET_KEY as string,
    ACCESS_TOKEN_TIME
  );
  return {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    avatarUrl: user.avatarUrl,
    access_token: access_token,
    refresh_token: refresh_token,
  };
}

export const updateUser = async (req: any, res: any) => {
  const { username, oldPassword, newPassword } = req.body;
  const imageName = `${Math.random()}-${req.file?.originalname || ""}`.replace(
    /\//g,
    ""
  );
  const imagePath = `${SUPABASE_URL}/storage/v1/object/public/avatar/${imageName}`;
  console.log("req.user.id:", req.user);
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    res.status(HTTP_NOT_FOUND).send("User not found");
    return;
  }
  const isValidPassword =
    oldPassword && (await bcrypt.compare(oldPassword, user?.password || ""));

  if (req.file?.originalname) {
    const { error: errorUploadImg } = await supabase.storage
      .from("avatar")
      .upload(imageName, req.file.buffer);
    user.avatarUrl = imagePath;

    if (errorUploadImg) {
      res.status(HTTP_BAD_REQUEST).send("Avatar couldn't be uploaded");
      return;
    }
  }

  if (oldPassword && isValidPassword) {
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    user.password = encryptedPassword;
  }

  if (oldPassword && !isValidPassword) {
    res.status(HTTP_BAD_REQUEST).send("Old password didn't correct!");
    return;
  }

  username && (user.username = username);

  user.save();
  res.send(user);
};

export const handleCreateNewToken = async (req: any, res: any) => {
  const refresh_token = req.body.refreshToken as string;
  if (!refresh_token) {
    return res.status(HTTP_UNAUTHORIZED).send("No have refresh token");
  }
  try {
    const decodedUser = verify(
      refresh_token,
      process.env.REFESH_SECRET_KEY as string
    ) as JwtPayload;
    const user = await UserModel.findById(decodedUser.id);
    res.send({
      newToken: createToken(
        user,
        process.env.ACCESS_SECRET_KEY as string,
        ACCESS_TOKEN_TIME
      ),
    });
  } catch (error) {
    res.status(HTTP_UNAUTHORIZED).send(REFRESH_TOKEN_EXPIRED);
  }
};

function createToken(
  user: any,
  secretKey: string,
  expiresTime: number | string
) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    secretKey,
    {
      expiresIn: expiresTime,
    }
  );
}
