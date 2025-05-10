import Joi from "joi";
import { GET_DB } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

// Tên collection
const CART_COLLECTION_NAME = 'carts';

// Schema xác thực thông tin giỏ hàng
const CART = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().required().min(1),
      name: Joi.string().optional(),
      price: Joi.number().optional(),
      originalPrice: Joi.number().optional(),  // ✅ Thêm dòng này
      promotion: Joi.string().optional(),      // ✅ Thêm dòng này
      avatar: Joi.string().default(null),
      images: Joi.array().items(Joi.string()).optional()  // <<< thêm dòng này
    })
  ).default([])

});

// Validate trước khi tạo giỏ hàng
const validateBeforeCreateCart = async (data) => {
  return await CART.validateAsync(data, { abortEarly: false });
};

// Tìm giỏ hàng của người dùng theo userId
const findCartByUserId = async (userId) => {
  try {
    return await GET_DB().collection(CART_COLLECTION_NAME).findOne({ userId });
  } catch (error) {
    throw new Error(error);
  }
};

// Tạo mới một giỏ hàng
const createCart = async (data) => {
  try {
    const validData = await validateBeforeCreateCart(data);
    const result = await GET_DB().collection(CART_COLLECTION_NAME).insertOne(validData);

    const newCart = await GET_DB().collection(CART_COLLECTION_NAME).findOne({ _id: result.insertedId });
    return newCart;
  } catch (error) {
    throw new Error(error);
  }
};

// Cập nhật giỏ hàng
const updateCart = async (userId, cart) => {
  const db = await GET_DB();
  await db.collection(CART_COLLECTION_NAME).updateOne(
    { userId: userId },
    { $set: { items: cart.items, updatedAt: new Date() } }
  );
  return cart;
};

// Thêm sản phẩm vào giỏ hàng
const addItemToCart = async (userId, item) => {
  if (!item || !item.productId) {
    throw new Error("Thiếu thông tin sản phẩm.");
  }

  let cart = await findCartByUserId(userId);

  if (!cart) {
    // Nếu chưa có giỏ thì tạo mới
    await createCart({
      userId,
      items: [item]
    });
    cart = await findCartByUserId(userId);
  } else {
    // Kiểm tra sản phẩm đã có chưa
    const existingIndex = cart.items.findIndex(
      (i) => i.productId.toString() === item.productId.toString()
    );

    if (existingIndex !== -1) {
      // Nếu đã có thì tăng số lượng
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      // Nếu chưa có thì thêm sản phẩm vào giỏ
      cart.items.push(item);
    }

    // Cập nhật giỏ hàng
    await updateCart(userId, { items: cart.items });
  }

  return await findCartByUserId(userId);
};

// Lấy thông tin giỏ hàng
const getCart = async (userId) => {
  const cart = await findCartByUserId(userId);
  if (!cart) {
    throw new Error("Không tìm thấy giỏ hàng.");
  }
  return cart;
};

// Xóa sản phẩm khỏi giỏ hàng
const removeItemFromCart = async (userId, productId) => {
  try {
    const result = await GET_DB().collection(CART_COLLECTION_NAME).updateOne(
      { userId: userId },
      {
        $pull: { items: { productId: productId } } // Xóa sản phẩm theo productId
      }
    );

    if (result.modifiedCount === 0) {
      return false;  // Trả về false nếu không có sản phẩm nào bị xóa
    }
    return true; // Trả về true nếu thành công
  } catch (error) {
    throw new Error('Lỗi khi xóa sản phẩm khỏi giỏ: ' + error.message);
  }
};


// Export các hàm thao tác với giỏ hàng
export const cartModel = {
  CART,
  validateBeforeCreateCart,
  createCart,
  findCartByUserId,
  updateCart,
  addItemToCart,
  getCart,
  removeItemFromCart
};
