import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { ProductModel } from "../models/products.model";

export const getProducts = async (req: any, res: any) => {
  try {
    const products = await ProductModel.find();
    res.send(products);
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).send("Products not found!");
  }
};

export const getProductDetail = async (req: any, res: any) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    res.send(product);
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).send("Product not found!");
  }
};

export const searchProduct = async (req: any, res: any) => {
  try {
    const searchRegex = new RegExp(req.params.searchKey, "i");
    const products = await ProductModel.find({ name: { $regex: searchRegex } });
    res.send(products);
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).send("Products not found!");
  }
};

export const getTags = async (req: any, res: any) => {
  try {
    const tags = await ProductModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          code: "$_id",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "all",
      code: "all",
    };

    tags.unshift(all);
    res.send(tags);
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).send("Tags not found!");
  }
};

export const getTag = async (req: any, res: any) => {
  try {
    const products = await ProductModel.find({ tags: req.params.tagName });
    res.send(products);
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).send("Tag not found!");
  }
};
