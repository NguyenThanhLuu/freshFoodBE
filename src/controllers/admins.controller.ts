import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderStatus } from "../constants/order_status";
import { OrderModal } from "../models/orders.model";
import { ProductModel } from "../models/products.model";
import supabase, { SUPABASE_URL } from "../services/supabase";

export const addProduct = async (req: any, res: any) => {
  const { name, price, discountPrice, tags } = req.body;
  const imageName = `${Math.random()}-${req.file?.originalname || ""}`.replace(
    /\//g,
    ""
  );
  const imagePath = `${SUPABASE_URL}/storage/v1/object/public/products/${imageName}`;

  if (req.file?.originalname) {
    const { error: errorUploadImg } = await supabase.storage
      .from("products")
      .upload(imageName, req.file.buffer);

    if (errorUploadImg) {
      res.status(HTTP_BAD_REQUEST).send("Avatar couldn't be uploaded");
      return;
    }
  }

  const product = await ProductModel.create({
    name,
    price,
    discountPrice,
    tags: tags.split(","),
    imageUrl: imagePath,
  });

  if (!product) {
    res.status(HTTP_BAD_REQUEST).send("Add new product fail");
    return;
  }
  res.send(product);
};

export const getAllCustomerOrders = async (req: any, res: any) => {
  try {
    const orders = await OrderModal.find();
    res.send(orders);
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).send("Get all customer orders failed!");
  }
};

export const getAllOrdersFinished = async (req: any, res: any) => {
  try {
    let now = new Date();
    let startDate;
    switch (req.params.time) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "threeMonth":
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      default:
        return;
    }
    const orders = await OrderModal.find({
      status: OrderStatus.FINISHED,
      updatedAt: { $gte: startDate },
    }).sort({ updatedAt: -1 });
    res.send(orders);
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).send("Get all customer orders failed!");
  }
};

export const updateProduct = async (req: any, res: any) => {
  const { name, price, discountPrice, tags } = req.body;
  const imageName = `${Math.random()}-${req.file?.originalname || ""}`.replace(
    /\//g,
    ""
  );
  const imagePath = `${SUPABASE_URL}/storage/v1/object/public/products/${imageName}`;
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    res.status(HTTP_BAD_REQUEST).send("Add new product fail");
    return;
  }

  if (req.file?.originalname) {
    const { error: errorUploadImg } = await supabase.storage
      .from("products")
      .upload(imageName, req.file.buffer);
    product.imageUrl = imagePath;

    if (errorUploadImg) {
      res.status(HTTP_BAD_REQUEST).send("Avatar couldn't be uploaded");
      return;
    }
  }

  product.name = name;
  product.price = price;
  product.discountPrice = discountPrice;
  product.tags = tags;
  product.save();
  res.send(product);
};

export const deleteProduct = async (req: any, res: any) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.send({ message: "Product was deleted!" });
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).send("Delete failed!");
  }
};

export const updateOrderStatus = async (req: any, res: any) => {
  try {
    const order = await OrderModal.findById(req.params.id);
    if (!order) {
      res.status(HTTP_BAD_REQUEST).send("Can't find order!");
      return;
    }
    order.status = req.body.orderStatus;
    order.save();
    res.send(order);
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).send("Update order status failed!");
  }
};
