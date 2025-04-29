import Joi from 'joi';

const ORDER_ITEM_COLLECTION_NAME = 'order_items';

// Schema xác thực thông tin chi tiết đơn hàng
const ORDER_ITEM_COLLECTION_SCHEMA = Joi.object({
  // ID đơn hàng, bắt buộc
  orderId: Joi.string().required(),

  // ID sản phẩm, bắt buộc
  productId: Joi.string().required(),

  // Số lượng sản phẩm trong chi tiết đơn hàng, bắt buộc
  quantity: Joi.number().required(),

  // Giá sản phẩm trong chi tiết đơn hàng, bắt buộc
  price: Joi.number().required(),

  // Thời gian tạo sản phẩm, mặc định là thời gian hiện tại
  createdAt: Joi.date().timestamp('javascript').default(Date.now),

  // Thời gian cập nhật sản phẩm, mặc định là null
  updatedAt: Joi.date().timestamp('javascript').default(null),

  // Trạng thái bị xóa, mặc định là false
  _destroy: Joi.boolean().default(false),
});

export { ORDER_ITEM_COLLECTION_NAME, ORDER_ITEM_COLLECTION_SCHEMA };
