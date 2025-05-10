import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { orderController } from '../controllers/orderController.js'; // Đảm bảo nhập đúng controller

const Router = express.Router();

Router.route('/order')
  .post(authMiddleware.isAuthorized, orderController.createOrder)
  .get(authMiddleware.isAuthorized, orderController.getAllOrders);

Router.route('/order/:id')
  .delete(authMiddleware.isAuthorized, authMiddleware.isAdmin, orderController.deleteOrder)
  .get(authMiddleware.isAuthorized, authMiddleware.isAdmin, orderController.getOrderById);

Router.route('/order/:id/status')
  .patch(authMiddleware.isAuthorized, authMiddleware.isAdmin, orderController.updateStatus);

export const orderRoute = Router;
