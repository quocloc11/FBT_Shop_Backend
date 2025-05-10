import express from 'express'
import { helloController } from "../controllers/helloController.js";
import { userValidation } from '../validations/userValidation.js';
import { userController } from '../controllers/userControlles.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { multerUploadMiddlere } from '../middlewares/multerUploadMiddleware.js';




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
Router.route('/update')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddlere.upload.single('avatar'),
    userValidation.update,
    userController.update)

Router.route('/refresh_token')
  .get(userController.refreshToken)


Router.get('/dashboard', authMiddleware.isAuthorized, authMiddleware.isAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome to Admin Dashboard' })
})

Router.route('/users')
  .get(authMiddleware.isAuthorized, authMiddleware.isAdmin, userController.getAllUsers);

Router.route('/users/:id')
  .patch(
    authMiddleware.isAuthorized,
    multerUploadMiddlere.upload.single('avatar'),
    userController.editUser
  )

Router.route('/users/:id')
  .delete(
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    userController.deleteUser
  )


export const userRoute = Router

