import { cartModel } from "../models/cartModel.js";

// Thêm sản phẩm vào giỏ hàng
const addItemToCart = async (userId, item) => {
  if (!item || !item.productId) {
    throw new Error("Thiếu thông tin sản phẩm.");
  }

  // ✅ Chuyển images thành mảng nếu nó là string
  if (item.images && typeof item.images === 'string') {
    item.images = [item.images];
  }

  let cart = await cartModel.findCartByUserId(userId);


  if (!cart) {
    // Nếu chưa có giỏ thì tạo mới
    await cartModel.createCart({
      userId,
      items: [item]
    });
    cart = await cartModel.findCartByUserId(userId);
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
    await cartModel.updateCart(userId, { items: cart.items });
  }

  return await cartModel.findCartByUserId(userId);
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

  // ✅ Trả về giỏ hàng mới sau khi xóa
  const updatedCart = await cartModel.findCartByUserId(userId);
  return updatedCart;
};


// Export các hàm thao tác với giỏ hàng
export const cartService = {
  addItemToCart,
  getCart,
  removeItemFromCart,
};
