import { cartModel } from "../models/cartModel.js";

// Thêm sản phẩm vào giỏ hàng
const addItemToCart = async (userId, item) => {
  console.log('item', item);

  if (!item || !item.name) {
    throw new Error("Thiếu thông tin sản phẩm.");
  }

  // Nếu không có `productId`, tạo `productId` từ `name` hoặc `id`
  let productId = item.productId || item.name;  // Sử dụng `name` làm `productId` nếu không có

  // Tìm giỏ hàng của user
  let cart = await cartModel.findCartByUserId(userId);

  if (!cart) {
    // Nếu chưa có thì tạo mới
    cart = await cartModel.createCart({
      userId,
      items: [{ ...item, productId }], // Dùng `productId` đã tạo
    });
  } else {
    // Kiểm tra sản phẩm đã có chưa
    const existingItem = cart.items.find(
      (i) => i.productId.toString() === productId.toString()
    );

    if (existingItem) {
      // Nếu đã có thì tăng số lượng
      existingItem.quantity += item.quantity;
    } else {
      // Nếu chưa có thì thêm sản phẩm vào giỏ
      cart.items.push({ ...item, productId });
    }

    // Cập nhật giỏ hàng
    cart = await cartModel.updateCart(userId, cart);
  }

  return cart;
};


// Lấy thông tin giỏ hàng của user
const getCart = async (userId) => {
  const cart = await cartModel.getCart(userId);
  return cart;
};

// Xóa sản phẩm khỏi giỏ hàng
const removeItemFromCart = async (userId, productId) => {
  const removed = await cartModel.removeItemFromCart(userId, productId);
  if (!removed) {
    throw new Error('Không tìm thấy sản phẩm trong giỏ để xóa.');
  }
  return true;
};

// Export các hàm thao tác với giỏ hàng
export const cartService = {
  addItemToCart,
  getCart,
  removeItemFromCart,
};
