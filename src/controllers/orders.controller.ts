import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderModal } from "../models/orders.model";

export const updateOrder = async (req: any, res: any) => {
  const order = await OrderModal.findOne({ id: req.body.id });
  const { cart, status, totalPrice, name, address, paymentMethod, note } =
    req.body;
  if (!order) {
    res.status(HTTP_BAD_REQUEST).send("Order Not Found!");
    return;
  }
  order.cart = cart;
  order.status = status;
  order.totalPrice = totalPrice;
  order.name = name;
  order.address = address;
  order.paymentMethod = paymentMethod;
  order.note = note;
  order.save();
  res.send({ status: "success", message: "Order updated!" });
};

export const createOrder = async (req: any, res: any) => {
  const numberOrderBiggest: any = await OrderModal.find()
    .sort({ orderNumber: -1 })
    .limit(1);
  const newOrder = await OrderModal.create({
    ...req.body,
    userId: req.user.id,
    orderNumber: numberOrderBiggest.length
      ? numberOrderBiggest[0].orderNumber + 1
      : 1,
  });
  if (!newOrder) {
    res.status(HTTP_BAD_REQUEST).send("Order can't create");
    return;
  }
  res.send(newOrder);
};

export const getYourOrders = async (req: any, res: any) => {
  const yourOrders = await OrderModal.find({
    userId: req.user.id,
  }).sort({ createdAt: -1 });
  if (!yourOrders) {
    res.status(HTTP_BAD_REQUEST).send("Can't find any your orders");
  }
  res.send(yourOrders);
};
