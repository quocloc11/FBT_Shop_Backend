import { viewProductModel } from "../models/viewProductModel.js";
import { viewProductServices } from "../services/viewedProductServices.js";

const addViewedProduct = async (req, res) => {
  try {
    const userId = req.jwtDecoded._id;
    console.log('userId', userId)
    // const productId = req.params.id;
    const product = req.body;

    const existingProduct = await viewProductModel.isProductViewed(userId, product._id);


    if (existingProduct) {
      return res.end();
    }

    console.log('product controller', product)
    if (!product) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
    }

    const result = await viewProductServices.addViewedProduct(userId, product);
    res.status(201).json({ message: "Đã lưu sản phẩm đã xem.", data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getViewedProducts = async (req, res) => {
  try {
    const userId = req.jwtDecoded._id;
    const viewed = await viewProductServices.getViewedProducts(userId);
    res.json({ data: viewed });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const viewProductController = {
  addViewedProduct, getViewedProducts
}
