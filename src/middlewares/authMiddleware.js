import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '../provider/JwtProvider.js'
import { env } from '../config/environment.js'
import ApiError from '../utils/ApiError.js'

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken

  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    return
  }

  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    //console.log('accessTokenDecoded', accessTokenDecoded)

    req.jwtDecoded = accessTokenDecoded

    next()
  } catch (error) {
    console.log('authMiddleware', error)
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token'))
      return
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }

}

// Kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  if (!req.jwtDecoded || req.jwtDecoded.role !== 'admin') {
    return next(new ApiError(StatusCodes.FORBIDDEN, 'Access denied! Admins only.'))
  }
  next()
}

export const authMiddleware = { isAuthorized, isAdmin }