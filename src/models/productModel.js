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

  discountPrice: Joi.number().min(0).optional(),
  // Số lượng đã bán, mặc định là 0
  sold: Joi.number().default(0),

  // Thời gian tạo sản phẩm, mặc định là thời gian hiện tại
  createdAt: Joi.date().timestamp('javascript').default(Date.now),

  // Thời gian cập nhật sản phẩm, mặc định là null
  updatedAt: Joi.date().timestamp('javascript').default(null),

  // Trạng thái bị xóa, mặc định là false
  _destroy: Joi.boolean().default(false),
  //flaseSale: Joi.boolean().required(), // Trường falseSale phải là boolean



  flashSale: Joi.object({
    isActive: Joi.boolean().default(false),
    saleStart: Joi.date().timestamp('javascript').required(),
    saleEnd: Joi.date().timestamp('javascript').required(),
    discountPercent: Joi.number().min(0).max(100),
    quantity: Joi.number().min(0)
  }).optional(),

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

const getProduct = async (page, limit, category) => {
  try {
    const collection = GET_DB().collection("products");

    const query = category ? { category } : {}; // ← nếu có category thì lọc

    const projection = {
      _id: 1, name: 1, price: 1, quantity: 1, image: 1, category: 1, stock: 1, sold: 1,
      description: 1, specs: 1, video: 1, promotion: 1, images: 1, brand: 1,
      flashSale: 1, saleStart: 1, saleEnd: 1, discountPrice: 1
    };

    const totalItems = await collection.countDocuments(query);

    let cursor = collection.find(query, { projection });

    if (page && limit) {
      const skip = (page - 1) * limit;
      cursor = cursor.skip(skip).limit(limit);

      const products = await cursor.toArray();

      return {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        products
      };
    }

    const allProducts = await cursor.toArray();
    return {
      totalItems,
      products: allProducts
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateAProduct = async (id, data) => {
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
const updateFalseSaleStatus = async (productId, flashSale, startDate, endDate) => {
  try {
    // Cập nhật trường "falseSale" trong cơ sở dữ liệu
    const result = await GET_DB()
      .collection("products")
      .findOneAndUpdate(
        { _id: new ObjectId(productId) },
        // { $set: { flashSale: flashSale } }, // Thay đổi trạng thái flashSale
        {
          $set: {
            flashSale,
            saleStart: startDate,
            saleEnd: endDate,
          },
        },
        { returnDocument: 'after' }
      );

    return result
  } catch (error) {
    throw new Error(error.message);
  }
};
const suggestSearch = async (keyword) => {
  try {
    const collection = GET_DB().collection("products");  // Truy cập vào collection sản phẩm trong DB
    const query = keyword
      ? { name: { $regex: keyword, $options: 'i' } }  // Tìm kiếm không phân biệt hoa thường
      : {};  // Nếu không có keyword, trả về tất cả sản phẩm

    const projection = {
      _id: 1, name: 1, price: 1, quantity: 1, image: 1, category: 1, stock: 1, sold: 1,
      description: 1, specs: 1, video: 1, promotion: 1, images: 1, brand: 1,
      flashSale: 1, saleStart: 1, saleEnd: 1, discountPrice: 1
    };

    // Lấy các sản phẩm gợi ý
    const productSuggestions = await collection.find(query, { projection }).limit(5).toArray();

    // Lấy các từ khóa gợi ý (có thể mở rộng thêm theo cách khác)
    const keywordSuggestions = await collection.find(
      { name: { $regex: keyword, $options: 'i' } },
      { projection }
    ).limit(5).toArray();

    return { keywords: keywordSuggestions, products: productSuggestions };
  } catch (error) {
    throw new Error('Truy vấn dữ liệu thất bại: ' + error.message);
  }
};


export const productModel = {
  PRODUCT,
  createAProduct, getProduct, deleteAProduct, updateAProduct,
  findOneById, updateFalseSaleStatus, suggestSearch
}