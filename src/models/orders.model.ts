import { Schema, model } from "mongoose";

export const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    cart: { type: [Object], required: true },
    status: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    note: { type: String, required: false },
    orderNumber: { type: Number, unique: true, required: true },
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

export const OrderModal = model("orders", OrderSchema);
