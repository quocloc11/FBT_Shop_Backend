import Joi from 'joi';

const PROMOTION_COLLECTION_NAME = 'promotions';

// Schema xác thực thông tin khuyến mãi
const PROMOTION_COLLECTION_SCHEMA = Joi.object({
  // Mã khuyến mãi, bắt buộc và phải là duy nhất
  code: Joi.string().required().unique(),

  // Phần trăm giảm giá của khuyến mãi, bắt buộc
  discount: Joi.number().required(),

  // Ngày bắt đầu khuyến mãi, bắt buộc
  startDate: Joi.date().required(),

  // Ngày kết thúc khuyến mãi, bắt buộc
  endDate: Joi.date().required(),

  // Mô tả khuyến mãi, không bắt buộc
  description: Joi.string().optional().allow(''),

  // Thời gian tạo khuyến mãi, mặc định là thời gian hiện tại
  createdAt: Joi.date().timestamp('javascript').default(Date.now),

  // Thời gian cập nhật khuyến mãi, mặc định là null
  updatedAt: Joi.date().timestamp('javascript').default(null),
});

export { PROMOTION_COLLECTION_NAME, PROMOTION_COLLECTION_SCHEMA };
