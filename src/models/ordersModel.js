import Joi from 'joi';

const ORDER_COLLECTION_NAME = 'orders';

// Schema xác thực thông tin đơn hàng
const ORDER_COLLECTION_SCHEMA = Joi.object({
  // ID người dùng, bắt buộc
  userId: Joi.string().required(),

  // Các sản phẩm trong đơn hàng, bắt buộc
  products: Joi.array().items(
    Joi.object({
      // ID sản phẩm, bắt buộc
      productId: Joi.string().required(),

      // Số lượng sản phẩm, bắt buộc
      quantity: Joi.number().required(),

      // Giá sản phẩm, bắt buộc
      price: Joi.number().required(),
    })
  ).required(),

  // Tổng giá trị đơn hàng, bắt buộc
  totalAmount: Joi.number().required(),

  // Trạng thái đơn hàng, mặc định là 'processing'
  status: Joi.string().valid('processing', 'shipped', 'delivered', 'cancelled').default('processing'),

  // Địa chỉ giao hàng, bắt buộc
  shippingAddress: Joi.string().required(),

  // Phương thức thanh toán, bắt buộc
  paymentMethod: Joi.string().valid('COD', 'bank_transfer').required(),

  // Thời gian tạo đơn hàng, mặc định là thời gian hiện tại
  createdAt: Joi.date().timestamp('javascript').default(Date.now),

  // Thời gian cập nhật đơn hàng, mặc định là null
  updatedAt: Joi.date().timestamp('javascript').default(null),
});

export { ORDER_COLLECTION_NAME, ORDER_COLLECTION_SCHEMA };
