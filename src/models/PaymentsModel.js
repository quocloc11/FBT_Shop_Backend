import Joi from 'joi';

const PAYMENT_COLLECTION_NAME = 'payments';

// Schema xác thực thông tin thanh toán
const PAYMENT_COLLECTION_SCHEMA = Joi.object({
  // ID đơn hàng, bắt buộc
  orderId: Joi.string().required(),

  // Số tiền thanh toán, bắt buộc
  amount: Joi.number().required(),

  // Phương thức thanh toán, bắt buộc
  paymentMethod: Joi.string().valid('bank_transfer', 'COD').required(),

  // Trạng thái thanh toán, bắt buộc
  paymentStatus: Joi.string().valid('paid', 'unpaid').required(),

  // Thời gian tạo thanh toán, mặc định là thời gian hiện tại
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
});

export { PAYMENT_COLLECTION_NAME, PAYMENT_COLLECTION_SCHEMA };
