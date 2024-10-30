import { Schema, model } from "mongoose";

export const UserSchema = new Schema(
  {
    id: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    username: { type: String, required: true },
    avatarUrl: { type: String, required: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export const UserModel = model("users", UserSchema);
