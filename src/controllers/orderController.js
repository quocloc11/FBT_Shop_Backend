import { orderServices } from "../services/orderServices.js";

const createOrder = async (req, res) => {
  try {
    const order = await orderServices.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderServices.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderServices.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const result = await orderServices.deleteOrder(req.params.id);
    if (!result) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json({ message: 'Xoá thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await orderServices.updateOrderStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    res.json({ order: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const orderController = {
  createOrder, getAllOrders, getOrderById, deleteOrder, updateStatus
}
