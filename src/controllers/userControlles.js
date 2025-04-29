import { helloServices } from "../services/helloServices.js"
import { userServices } from "../services/userServices.js"
import { StatusCodes } from 'http-status-codes'

import ms from 'ms'
import ApiError from "../utils/ApiError.js"
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
const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const userAvatarFile = req.file
    console.log('userAvarFile', userAvatarFile)
    const updatedUser = await userServices.update(userId, req.body, userAvatarFile)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)

  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userServices.getAllUsers()
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}

const editUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const userAvatarFile = req.file
    const updatedUser = await userServices.updateUser(userId, req.body, userAvatarFile)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    await userServices.deleteUser(userId)
    res.status(StatusCodes.OK).json({ message: 'User deleted successfully.' })
  } catch (error) {
    next(error)
  }
}


export const userController = {
  login, register, refreshToken, logout, update, getAllUsers,
  editUser, deleteUser
}
