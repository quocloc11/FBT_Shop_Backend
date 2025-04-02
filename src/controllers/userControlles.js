import { helloServices } from "../services/helloServices.js"
import { userServices } from "../services/userServices.js"
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
const login = async (req, res, next) => {
  try {
    const result = await userServices.login(req.body)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const result = await userServices.register(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userServices.refreshToken(req.cookies?.refreshToken)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In! (Error from refresh Token'))

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
const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) {
    next(error)

  }
}
export const userController = {
  login, register, refreshToken, logout
}
