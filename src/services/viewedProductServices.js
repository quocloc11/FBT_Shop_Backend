import { viewProductModel } from "../models/viewProductModel.js";

const addViewedProduct = async (userId, reqBody) => {
  if (!reqBody || !reqBody._id) {
    throw new Error("Thiếu thông tin sản phẩm.");
  }

  const viewProduct = await viewProductModel.saveViewedProduct(userId, reqBody);
  // Xoá bản cũ nếu đã có sản phẩm đó
  // await ViewProductModel.deleteOne({ "product._id": product._id });

  // const viewed = new ViewProductModel({ product });
  // return await viewed.save();
  return viewProduct
};

const getViewedProducts = async (userId, limit = 20) => {
  // return await viewProductModel.find({ userId })
  // .sort({ viewedAt: -1 })
  // .limit(limit);
  const listViewProduct = await viewProductModel.getViewProduct(userId)
  return listViewProduct
};

export const viewProductServices = {
  addViewedProduct,
  getViewedProducts
};
