import Joi from 'joi';

const REVIEW_COLLECTION_NAME = 'reviews';

// Schema xác thực thông tin đánh giá sản phẩm
const REVIEW_COLLECTION_SCHEMA = Joi.object({
  // ID người dùng, bắt buộc
  userId: Joi.string().required(),

  // ID sản phẩm, bắt buộc
  productId: Joi.string().required(),

  // Đánh giá sản phẩm, giá trị trong khoảng từ 0 đến 5, bắt buộc
  rating: Joi.number().min(0).max(5).required(),

  // Bình luận của người dùng về sản phẩm, không bắt buộc
  comment: Joi.string().optional().allow(''),

  // Thời gian tạo đánh giá, mặc định là thời gian hiện tại
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
});

export { REVIEW_COLLECTION_NAME, REVIEW_COLLECTION_SCHEMA };
