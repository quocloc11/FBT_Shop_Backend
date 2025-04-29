import Joi from "joi"
import { GET_DB } from "../config/mongodb.js"
import { ObjectId } from "mongodb";

const PRODUCT_COLLECTION_NAME = 'products';

// Schema xác thực thông tin sản phẩm
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


  // flashSale: Joi.object({
  //   isActive: Joi.boolean().default(false),
  //   discountPercent: Joi.number().min(0).max(100),
  //   startTime: Joi.date().timestamp('javascript'),
  //   endTime: Joi.date().timestamp('javascript')
  // }).optional(),
  // gifts: Joi.array().items(Joi.string()).optional(),
  // badges: Joi.array().items(
  //   Joi.string().valid('new', 'hot', 'exclusive', 'installment', 'bestseller', 'limited')
  // ).optional(),
  // comboProducts: Joi.array().items(Joi.string()).optional(),
  // warranty: Joi.object({
  //   durationMonths: Joi.number().optional(),
  //   type: Joi.string().valid('official', 'store', 'none')
  // }).optional(),
  // isFeatured: Joi.boolean().default(false),
  // isBestSeller: Joi.boolean().default(false),
  // isNewArrival: Joi.boolean().default(false),
  // isOnSale: Joi.boolean().default(false),
  // isFavorite: Joi.boolean().default(false),
  // isComparable: Joi.boolean().default(true),
  // isReviewable: Joi.boolean().default(true),
  // isShareable: Joi.boolean().default(true),
  // isContactable: Joi.boolean().default(true),
  // isOrderable: Joi.boolean().default(true),
  // isPayable: Joi.boolean().default(true),
  // isShippable: Joi.boolean().default(true),
  // isReturnable: Joi.boolean().default(true),
  // isWarranty: Joi.boolean().default(true),
  // isSupport: Joi.boolean().default(true),
  // isReview: Joi.boolean().default(true),
  // isContact: Joi.boolean().default(true),
  // isShare: Joi.boolean().default(true),
  // isCompare: Joi.boolean().default(true),
  // isFavorite: Joi.boolean().default(true),
  // isNew: Joi.boolean().default(false),
  // isBestSeller: Joi.boolean().default(false),
  // isOnSale: Joi.boolean().default(false),
  // isFeatured: Joi.boolean().default(false),
  // isPromotion: Joi.boolean().default(false),
  // isFlashSale: Joi.boolean().default(false),
  // isCombo: Joi.boolean().default(false),
  // isGift: Joi.boolean().default(false),
  // isVoucher: Joi.boolean().default(false),
  // isCoupon: Joi.boolean().default(false),
  // isDiscountCode: Joi.boolean().default(false),
  // isPromotionCode: Joi.boolean().default(false),

});


const validateBeforeCreateAProduct = async (data) => {
  return await PRODUCT.validateAsync(data, { abortEarly: false })

}
const checkProductExists = async (name) => {
  const existingProduct = await GET_DB().collection("products").findOne({ name });
  return existingProduct;
};
const createAProduct = async (data) => {
  console.log("Received data:", data);

  try {
    // Kiểm tra và validate dữ liệu đầu vào
    const validData = await validateBeforeCreateAProduct(data);
    if (!validData || !validData.name) {
      throw new Error("Invalid product data.");
    }

    // Kiểm tra xem sản phẩm đã tồn tại chưa
    const productExists = await checkProductExists(validData.name);
    if (productExists) {
      throw new Error("Product with the same name already exists.");
    }

    // Tạo sản phẩm mới
    const createdProduct = await GET_DB()
      .collection("products")
      .insertOne(validData);

    // Lấy sản phẩm vừa tạo từ database
    const product = await GET_DB()
      .collection("products")
      .findOne({ _id: createdProduct.insertedId });

    // Lọc các trường không cần thiết
    const { createdAt, updatedAt, _destroy, ...productResponse } = product;

    console.log("Product created:", productResponse);
    return productResponse;  // Trả về dữ liệu không có các trường không cần thiết
  } catch (error) {
    console.error("Error creating product:", error);
    throw error; // Truyền lỗi đi để xử lý ở phía frontend
  }
};


const findOneById = async (Id) => {
  try {
    const result = await GET_DB().collection("product").findOne({
      _id: new ObjectId(Id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}


const getProduct = async () => {
  try {
    const products = await GET_DB().collection("products")
      .find({}, { projection: { _id: 1, name: 1, price: 1, quantity: 1, image: 1, category: 1, stock: 1, sold: 1, description: 1, specs: 1, video: 1, promotion: 1, images: 1, brand: 1 } })
      .toArray();
    if (!products) throw new Error("Product not found");
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateAProduct = async (id, data) => {
  console.log(data)
  try {
    const result = await GET_DB().collection("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}
const deleteAProduct = async (id) => {
  try {
    const result = await GET_DB().collection("products").deleteMany({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const productModel = {
  PRODUCT,
  createAProduct, getProduct, deleteAProduct, updateAProduct,
  findOneById
}