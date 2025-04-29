import Joi from "joi"
import { GET_DB } from "../config/mongodb.js"
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from "../utils/validators.js"

const PRODUCT = Joi.object({
  // Tên sản phẩm, bắt buộc
  name: Joi.string().required().trim().strict(),

  // Danh mục sản phẩm, bắt buộc
  category: Joi.string().required(),

  // Giá sản phẩm, bắt buộc
  price: Joi.number().required(),

  // Số lượng sản phẩm, bắt buộc
  quantity: Joi.number().required(),

  // Số lượng tồn kho, mặc định là 0
  stock: Joi.number().default(0),

  brand: Joi.string().required(),

  // Mô tả sản phẩm, không bắt buộc
  description: Joi.string().optional().allow(''),

  // Video sản phẩm, không bắt buộc
  video: Joi.string().optional().allow(''),

  // Khuyến mãi áp dụng cho sản phẩm, không bắt buộc
  promotion: Joi.string().optional().allow(''),

  // Thông số kỹ thuật của sản phẩm, chuyển thành chuỗi (string)
  specs: Joi.string().optional().allow(''),

  // Hình ảnh sản phẩm, chuyển thành chuỗi (string), nếu có nhiều ảnh, chúng sẽ được lưu dưới dạng chuỗi (URL cách nhau bằng dấu phẩy)
  images: Joi.string().optional().allow(''),

  // Đánh giá sản phẩm, mặc định là 0
  rating: Joi.number().min(0).max(5).default(0),

  // Số lượng đã bán, mặc định là 0
  sold: Joi.number().default(0),

  // Thời gian tạo sản phẩm, mặc định là thời gian hiện tại
  createdAt: Joi.date().timestamp('javascript').default(Date.now),

  // Thời gian cập nhật sản phẩm, mặc định là null
  updatedAt: Joi.date().timestamp('javascript').default(null),

  // Trạng thái bị xóa, mặc định là false
  _destroy: Joi.boolean().default(false),

});


// const viewedProductSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   product: {
//     _id: String,
//     name: String,
//     image: String,
//     price: Number,
//     category: String,
//     brand: String,
//   },
//   viewedAt: { type: Date, default: Date.now },
// });


// Lưu sản phẩm đã xem
const isProductViewed = async (userId, productId) => {
  try {
    const result = await GET_DB().collection("viewedproducts").findOne({
      userId: userId,
      "product._id": productId
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const saveViewedProduct = async (userId, product) => {
  try {


    const viewedProduct = {
      userId: userId,       // ID người dùng
      product: product,     // Sản phẩm đã xem
      viewedAt: new Date()  // Thời gian xem
    };

    const result = await GET_DB().collection("viewedproducts").insertOne(viewedProduct);
    console.log('result', result)
    if (result.insertedId) {
      console.log("Sản phẩm đã được lưu vào danh sách đã xem");
    }
  } catch (error) {
    console.error("Lỗi khi lưu sản phẩm đã xem:", error.message);
  }
};
const getViewProduct = async (userId, limit = 10) => {
  try {
    const products = await GET_DB()
      .collection("viewedproducts")
      .find({ userId })
      .sort({ viewedAt: -1 }) // Sắp xếp theo thời gian xem gần nhất
      .limit(limit)           // Giới hạn số lượng sản phẩm trả về (mặc định 10)
      .toArray();

    if (!products || products.length === 0) {
      return []; // Trả về mảng rỗng thay vì ném lỗi (tùy logic của bạn)
    }

    return products;
  } catch (error) {
    throw new Error(error.message || "Không thể lấy sản phẩm đã xem");
  }
};



export const viewProductModel = {
  saveViewedProduct, getViewProduct, isProductViewed
}