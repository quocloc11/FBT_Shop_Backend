import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { orderController } from '../controllers/orderController.js'; // Đảm bảo nhập đúng controller

const Router = express.Router();

Router.route('/order')
  .post(authMiddleware.isAuthorized, orderController.createOrder)
  .get(authMiddleware.isAuthorized, orderController.getAllOrders);

Router.route('/order/:id')
  .delete(authMiddleware.isAuthorized, orderController.deleteOrder)
  .get(authMiddleware.isAuthorized, orderController.getOrderById);

Router.route('/order/:id/status')
  .patch(authMiddleware.isAuthorized, orderController.updateStatus);

export const orderRoute = Router;
