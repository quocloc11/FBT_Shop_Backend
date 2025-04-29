import { orderModel } from "../models/orderModel.js";

const createOrder = async (data) => {
  try {
    return await orderModel.createOrder(data);
  } catch (error) {
    throw new Error("Lỗi khi tạo đơn hàng: " + error.message);
  }
};

const getAllOrders = async () => {
  try {
    return await orderModel.getAllOrders();
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách đơn hàng: " + error.message);
  }
};

const getOrderById = async (id) => {
  try {
    return await orderModel.getOrderById(id);
  } catch (error) {
    throw new Error("Lỗi khi lấy đơn hàng: " + error.message);
  }
};

const deleteOrder = async (id) => {
  try {
    return await orderModel.deleteOrder(id);
  } catch (error) {
    throw new Error("Lỗi khi xoá đơn hàng: " + error.message);
  }
};

const updateOrderStatus = async (id, status) => {
  try {
    return await orderModel.updateOrderStatus(id, status);
  } catch (error) {
    throw new Error("Lỗi khi cập nhật trạng thái đơn hàng: " + error.message);
  }
};

export const orderServices = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus
};
