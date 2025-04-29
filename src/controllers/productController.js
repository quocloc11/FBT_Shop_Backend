
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
    res.status(201).json(product);  // Trả về toàn bộ sản phẩm thay vì chỉ `insertedId`
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
const getProduct = async (req, res, next) => {
  try {
    const result = await productServices.getProduct()
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}



// const createNew = async (req, res, next) => {
//   try {
//     const createdCard = await userService.createNew(req.body)
//     res.status(StatusCodes.CREATED).json(createdCard)
//   } catch (error) {
//     next(error)
//     // console.log(error)
//     // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//     //   errors: error.message
//     // })
//   }
// }

// const updateAProduct = async (req, res, next) => {
//   try {
//     const productId = req.params.id;
//     const imageFiles = req.files; // ✅ lấy mảng ảnh
//     const productData = req.body; // ✅ lấy các field: name, price, description,...

//     console.log("BODY:", productData);
//     console.log("FILES:", imageFiles);

//     const updateProduct = await productServices.updateAProduct(productId, productData, imageFiles);

//     res.status(201).json(updateProduct);
//   } catch (error) {
//     next(error);
//   }
// }
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

export const productController = {
  createAProduct, getProduct, updateAProduct, deleteAProduct
}
