import { StatusCodes } from "http-status-codes";
import { cartService } from "../services/cartServices.js";

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const cart = await cartService.addItemToCart(userId, req.body);
    res.status(StatusCodes.CREATED).json(cart);
  } catch (error) {
    next(error);  // Đảm bảo gọi next để xử lý lỗi ở middleware
  }
};

// Lấy thông tin giỏ hàng của người dùng
const getCart = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const cart = await cartService.getCart(userId);

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Cart not found' });
    }

    res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    next(error);  // Đảm bảo gọi next để xử lý lỗi ở middleware
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const { productId } = req.params;  // Lấy productId từ URL params
    const cart = await cartService.removeItemFromCart(userId, productId);

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found in cart' });
    }

    res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    next(error);  // Đảm bảo gọi next để xử lý lỗi ở middleware
  }
};

export const cartController = {
  addToCart,
  getCart,
  removeFromCart,
};
