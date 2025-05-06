import express from 'express'
import { productController } from '../controllers/productController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { multerUploadMiddlere } from '../middlewares/multerUploadMiddleware.js'

// GET	Lấy dữ liệu từ server
// POST	Gửi dữ liệu mới lên server   POST được sử dụng khi tạo tài nguyên mới trên server.
// PUT	Cập nhật toàn bộ dữ liệu trên server
// PATCH	Cập nhật một phần dữ liệu
// DELETE	Xóa dữ liệu trên server

const Router = express.Router()

Router.route('/products')
  .post(authMiddleware.isAuthorized,
    multerUploadMiddlere.upload.single('images'),
    productController.createAProduct)
  .get(authMiddleware.isAuthorized, productController.getProduct)


Router.route('/products/:id')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddlere.upload.array('images'), // 👈 đổi single -> array
    productController.updateAProduct)

  .delete(authMiddleware.isAuthorized, productController.deleteAProduct)

Router.route('/products/:id/flash-sales')
  .put(authMiddleware.isAuthorized, productController.updateFalseSaleStatus);


export const productRoute = Router

