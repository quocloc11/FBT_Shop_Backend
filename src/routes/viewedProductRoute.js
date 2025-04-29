import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { viewProductController } from '../controllers/viewedProductController.js';

// GET	Lấy dữ liệu từ server
// POST	Gửi dữ liệu mới lên server   POST được sử dụng khi tạo tài nguyên mới trên server.
// PUT	Cập nhật toàn bộ dữ liệu trên server
// PATCH	Cập nhật một phần dữ liệu
// DELETE	Xóa dữ liệu trên server

const Router = express.Router()
// POST - Lưu sản phẩm đã xemauthMiddleware.isAuthorized,
Router.route("/viewed-products")
  .post(authMiddleware.isAuthorized, viewProductController.addViewedProduct)
  .get(authMiddleware.isAuthorized, viewProductController.getViewedProducts)


// Router.post("/viewed-products",  viewProductController.addViewedProduct);

// // GET - Lấy danh sách sản phẩm đã xem
// Router.get("/viewed-products", authMiddleware.isAuthorized, viewProductController.getViewedProducts);

export const viewProductRoute = Router;
