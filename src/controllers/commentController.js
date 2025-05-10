import { commentService } from '../services/commentService.js'
import { StatusCodes } from 'http-status-codes'

const addComment = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = req.jwtDecoded;
    const { content, rating } = req.body; // Thêm trường rating

    if (rating === undefined || rating === null) {
      return res.status(400).json({ error: 'Rating is required' });
    }

    const comment = await commentService.addComment(productId, user, content, rating); // Chuyển rating vào service
    res.status(StatusCodes.CREATED).json(comment);
  } catch (error) {
    next(error);
  }
}


const getCommentsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params
    const comments = await commentService.getCommentsByProduct(productId)
    res.status(StatusCodes.OK).json(comments)
  } catch (error) {
    next(error)
  }
}

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params
    const userId = req.jwtDecoded._id // Lấy userId từ token đã decode

    const result = await commentService.deleteComment(commentId, userId)

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Comment not found or already deleted' })
    }

    return res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    next(error)
  }
}


export const commentController = {
  addComment,
  getCommentsByProduct,
  deleteComment
}
