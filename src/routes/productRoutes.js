import express from 'express'
import { productController } from '../controllers/productController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'





// GET	Lấy dữ liệu từ server
// POST	Gửi dữ liệu mới lên server   POST được sử dụng khi tạo tài nguyên mới trên server.
// PUT	Cập nhật toàn bộ dữ liệu trên server
// PATCH	Cập nhật một phần dữ liệu
// DELETE	Xóa dữ liệu trên server

const Router = express.Router()

Router.route('/products')
  .post(authMiddleware.isAuthorized, productController.createAProduct)
  .get(authMiddleware.isAuthorized, productController.getProduct)


Router.route('/products/:id')
  .put(authMiddleware.isAuthorized, productController.updateAProduct)
  .delete(authMiddleware.isAuthorized, productController.deleteAProduct)



export const productRoute = Router

