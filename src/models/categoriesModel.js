import Joi from 'joi';

const CATEGORY_COLLECTION_NAME = 'categories';

// Schema xác thực thông tin danh mục sản phẩm
const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  // Tên danh mục, bắt buộc
  name: Joi.string().required().trim().strict(),

  // Mô tả danh mục, không bắt buộc
  description: Joi.string().optional().allow(''),

  // Thời gian tạo danh mục, mặc định là thời gian hiện tại
  createdAt: Joi.date().timestamp('javascript').default(Date.now),

  // Thời gian cập nhật danh mục, mặc định là null
  updatedAt: Joi.date().timestamp('javascript').default(null),
});

export { CATEGORY_COLLECTION_NAME, CATEGORY_COLLECTION_SCHEMA };
