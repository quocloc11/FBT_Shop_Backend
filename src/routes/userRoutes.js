import express from 'express'
import { helloController } from "../controllers/helloController.js";
import { userValidation } from '../validations/userValidation.js';
import { userController } from '../controllers/userControlles.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';




// GET	Lấy dữ liệu từ server
// POST	Gửi dữ liệu mới lên server   POST được sử dụng khi tạo tài nguyên mới trên server.
// PUT	Cập nhật toàn bộ dữ liệu trên server
// PATCH	Cập nhật một phần dữ liệu
// DELETE	Xóa dữ liệu trên server

const Router = express.Router()

Router.route('/login')
  .post(userValidation.login, userController.login)
Router.route('/register')
  .post(userValidation.register, userController.register)

Router.route('/logout')
  .delete(userController.logout)


Router.route('/refresh_token')
  .get(userController.refreshToken)


Router.get('/dashboard', authMiddleware.isAuthorized, authMiddleware.isAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome to Admin Dashboard' })
})
export const userRoute = Router

