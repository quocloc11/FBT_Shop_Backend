import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { cartController } from '../controllers/cartController.js';


// GET	Lấy dữ liệu từ server
// POST	Gửi dữ liệu mới lên server   POST được sử dụng khi tạo tài nguyên mới trên server.
// PUT	Cập nhật toàn bộ dữ liệu trên server
// PATCH	Cập nhật một phần dữ liệu
// DELETE	Xóa dữ liệu trên server

const Router = express.Router()

// POST: Thêm sản phẩm vào giỏ hàng
Router.route('/cart')
  .post(authMiddleware.isAuthorized, cartController.addToCart);

// GET: Lấy giỏ hàng của người dùng đang đăng nhập
Router.route('/cart')
  .get(authMiddleware.isAuthorized, cartController.getCart);

// DELETE: Xoá 1 sản phẩm khỏi giỏ hàng
Router.route('/cart/:productId')
  .delete(authMiddleware.isAuthorized, cartController.removeFromCart);


export const cartRoute = Router

