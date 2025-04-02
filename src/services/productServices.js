import { productModel } from "../models/productModel.js"
import { ObjectId } from "mongodb";


const createAProduct = async (reqBody) => {
  try {
    const newProduct = {
      ...reqBody
    }
    const createdUser = await productModel.createAProduct(newProduct)
    return createdUser
  } catch (error) {
    throw error
  }
}
const getProduct = async (reqBody) => {
  try {
    const listProduct = await productModel.getProduct()
    return listProduct
  } catch (error) {
    throw error
  }
}
const updateAProduct = async (id, reqBody) => {
  try {
    const newProduct = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updateUser = await productModel.updateAProduct(id, newProduct)
    return updateUser
  } catch (error) {
    throw error
  }
}
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


export const productServices = {
  createAProduct, getProduct, updateAProduct, deleteAProduct
}