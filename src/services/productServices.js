import { productModel } from "../models/productModel.js"
import { ObjectId } from "mongodb";
import { CloudinaryProvider } from "../provider/CloudinaryProvider.js";
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { pickUser } from '../utils/formatters.js'
// const createAProduct = async (reqBody) => {
//   try {
//     const newProduct = {
//       ...reqBody
//     }
//     const createdUser = await productModel.createAProduct(newProduct)
//     return createdUser
//   } catch (error) {
//     throw error
//   }
// }

const createAProduct = async (reqBody, userAvarFile) => {
  try {
    let imageUrl = null;

    if (userAvarFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(userAvarFile.buffer, 'products');
      console.log('uploadResult', uploadResult);
      imageUrl = uploadResult.url;
    }

    // Thêm image vào reqBody nếu có
    if (imageUrl) {
      reqBody.images = imageUrl;
    }

    const createdProduct = await productModel.createAProduct(reqBody);
    console.log('createdProduct', createdProduct);

    return createdProduct; // hoặc dùng hàm pickProduct nếu bạn có
  } catch (error) {
    throw error;
  }
};

// const getProduct = async (reqBody) => {
//   try {
//     const listProduct = await productModel.getProduct()
//     return listProduct
//   } catch (error) {
//     throw error
//   }
// }
// const getProduct = async (page, limit) => {
//   try {
//     const result = await productModel.getProduct(page, limit);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };
const getProduct = async (page, limit, category) => {
  try {
    return await productModel.getProduct(page, limit, category);
  } catch (error) {
    throw error;
  }
};


const updateAProduct = async (id, reqBody, imageFiles) => {
  try {
    const updateData = { ...reqBody }; // khởi tạo dữ liệu update từ req.body

    if (imageFiles && imageFiles.length > 0) {
      const uploadedImages = [];

      for (const file of imageFiles) {
        const result = await CloudinaryProvider.streamUpload(file.buffer, 'products');
        uploadedImages.push(result.secure_url);
      }

      updateData.images = uploadedImages; // thêm mảng ảnh vào dữ liệu update
    }

    const updatedProduct = await productModel.updateAProduct(id, updateData);
    console.log('updatedProduct', updatedProduct);
    return updatedProduct;

  } catch (error) {
    throw error;
  }
};

const deleteAProduct = async (idProduct) => {
  console.log('idProduct', idProduct)
  try {
    // Kiểm tra xem idProduct có hợp lệ không
    if (!ObjectId.isValid(idProduct)) {
      throw new Error("Invalid product ID format");
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    // const product = await productModel.findOneById(idProduct);
    // if (!product) {
    //   throw new Error("Product not found");
    // }

    // Tiến hành xóa sản phẩm
    const deletedProduct = await productModel.deleteAProduct(idProduct);
    return deletedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateFalseSaleStatus = async (productId, flashSale, startDate, endDate) => {
  try {
    // Gọi model để cập nhật trạng thái flaseSale và thời gian bắt đầu/kết thúc
    const updatedProduct = await productModel.updateFalseSaleStatus(productId, flashSale, startDate, endDate);

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};


export const productServices = {
  createAProduct, getProduct, updateAProduct, deleteAProduct, updateFalseSaleStatus
}