import Joi from "joi";
import { GET_DB } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

// Tên collection
const ORDER_COLLECTION_NAME = 'orders';

// Schema xác thực thông tin đơn hàng
const ORDER = Joi.object({
  customerName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      name: Joi.string().optional(),
      price: Joi.number().optional(),
      quantity: Joi.number().required().min(1)
    })
  ).default([]),
  total: Joi.number().required(),
  warrantyOption: Joi.string().default(''),
  status: Joi.string().valid('pending', 'confirmed', 'shipped').default('pending'),
  createdAt: Joi.date().default(new Date())

});

// Validate trước khi tạo đơn hàng
const validateBeforeCreateOrder = async (data) => {
  return await ORDER.validateAsync(data, { abortEarly: false });
};

// Tạo đơn hàng mới
const createOrder = async (data) => {
  try {
    const validData = await validateBeforeCreateOrder(data);
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).insertOne(validData);
    return await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({ _id: result.insertedId });
  } catch (error) {
    throw new Error(error);
  }
};

// Lấy tất cả đơn hàng (mới nhất trước)
const getAllOrders = async () => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME).find().sort({ createdAt: -1 }).toArray();
  } catch (error) {
    throw new Error(error);
  }
};

// Lấy đơn hàng theo ID
const getOrderById = async (id) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

// Xoá đơn hàng theo ID
const deleteOrder = async (id) => {
  try {
    return await GET_DB().collection(ORDER_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (id, status) => {
  try {
    await GET_DB().collection(ORDER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );
    return await getOrderById(id);
  } catch (error) {
    throw new Error(error);
  }
};

// Export tất cả các hàm thao tác với đơn hàng
export const orderModel = {
  ORDER,
  validateBeforeCreateOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus
};
