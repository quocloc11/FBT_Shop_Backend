
import { StatusCodes } from 'http-status-codes'
import { productServices } from '../services/productServices.js'



const createAProduct = async (req, res, next) => {
  try {
    // if (!req.body.name || !req.body.quantity || !req.body.price || !req.body.category || !req.brand) {
    //   return res.status(400).json({ error: "Missing required fields: name, quantity, price,category,brand" });
    // }
    const productAvatarFile = req.file
    console.log('productAvatarFile', productAvatarFile)
    const product = await productServices.createAProduct(req.body, productAvatarFile);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getProduct = async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const category = req.query.category || null;

    const result = await productServices.getProduct(page, limit, category);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


const updateAProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productFiles = req.files; // ⬅️ Đây là mảng file
    const body = req.body;

    const cleanData = {
      ...body,
      price: Number(body.price),
      stock: Number(body.stock),
      quantity: Number(body.quantity),
      sold: Number(body.sold || 0),
      discountPrice: Number(body.discountPrice),
      rating: Number(body.rating || 0),
    };

    const updatedProduct = await productServices.updateAProduct(productId, cleanData, productFiles);

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteAProduct = async (req, res, next) => {
  try {
    const deleteId = req.params.id;
    const deleteProduct = await productServices.deleteAProduct(deleteId);

    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Deleted successfully", data: deleteProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateFalseSaleStatus = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { flashSale } = req.body;

    if (typeof flashSale !== 'object' || typeof flashSale.isActive !== 'boolean') {
      return res.status(400).json({ error: "Invalid value for 'flashSale.isActive'. It should be a boolean." });
    }


    const startDate = new Date(flashSale.saleStart);
    const endDate = new Date(flashSale.saleEnd);


    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format for 'start' or 'end'." });
    }

    // Gọi service để cập nhật trạng thái falseSale và thời gian
    const updatedProduct = await productServices.updateFalseSaleStatus(productId, flashSale, startDate, endDate);

    // Nếu không tìm thấy sản phẩm
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Trả về kết quả cập nhật
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error); // Xử lý lỗi
  }
};
const suggestSearch = async (req, res, next) => {
  try {
    const keyword = req.query.keyword || '';
    const suggestions = await productServices.suggestSearch(keyword);
    res.status(200).json(suggestions);
  } catch (error) {
    next(error);  // Gửi lỗi tới middleware xử lý lỗi
  }
};


export const productController = {
  createAProduct, getProduct, updateAProduct, deleteAProduct, updateFalseSaleStatus, suggestSearch
}
