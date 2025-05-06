import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { userModel } from '../models/userModel.js'
import { v4 as uuidv4 } from 'uuid';
import { JwtProvider } from '../provider/JwtProvider.js';
import { pickUser } from '../utils/formatters.js'
import { env } from '../config/environment.js';
import ApiError from '../utils/ApiError.js';
// const salt = bcrypt.genSaltSync(10);
// const hash = bcrypt.hashSync("B4c0/\/", salt);
import { CloudinaryProvider } from "../provider/CloudinaryProvider.js"
import { GET_DB } from '../config/mongodb.js';
const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    // if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active')
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    }
    const userInfo = {
      _id: existUser._id,
      email: existUser.email,
      role: existUser.role
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    return { accessToken, refreshToken, ...pickUser(existUser) }
    return existUser
  } catch (error) {
    throw error
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {

    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE)
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )
    return { accessToken }
  } catch (error) { throw error }

}

const register = async (reqBody) => {
  try {
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), //tham so thu 2 do phuc tap
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }
    const createdUser = await userModel.register(newUser)
    //if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    // if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active')
    // if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
    //   throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    // }
    // const userInfo = {
    //   _id: existUser._id,
    //   email: existUser.email
    // }
    // const accessToken = await JwtProvider.generateToken(
    //   userInfo,
    //   env.ACCESS_TOKEN_SECRET_SIGNATURE,
    //   env.ACCESS_TOKEN_LIFE
    // )

    // const refreshToken = await JwtProvider.generateToken(
    //   userInfo,
    //   env.REFRESH_TOKEN_SECRET_SIGNATURE,
    //   env.REFRESH_TOKEN_LIFE
    // )

    //return { accessToken, refreshToken, ...pickUser(existUser) }
    return createdUser
  } catch (error) {
    throw error
  }
}
const update = async (userId, reqBody, userAvarFile) => {
  try {
    const existUser = await userModel.findOneById(userId)
    console.log('existUser', existUser)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')

    let updatedUser = {}

    if (reqBody.current_password && reqBody.new_password) {
      if (!bcryptjs.compareSync(reqBody.current_password, existUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Current  Password is incorrect!')
      }
      updatedUser = await userModel.update(existUser._id, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })
    } else if (userAvarFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(userAvarFile.buffer, 'users')
      console.log('uploadResult', uploadResult)

      updatedUser = await userModel.update(existUser._id, {
        avatar: uploadResult.secure_url
      })

    } else {
      updatedUser = await userModel.update(existUser._id, reqBody)
    }
    console.log('updatedUser', updatedUser)
    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

// const getAllUsers = async () => {
//   try {
//     const users = await userModel.getAllUsers()
//     return users.map(user => pickUser(user)) // lọc bớt dữ liệu nhạy cảm như password
//   } catch (error) {
//     throw error
//   }
// }

const getAllUsers = async ({ role, limit = 20, skip = 0 } = {}) => {
  try {
    const query = { _destroy: false }
    if (role) query.role = role

    const result = await GET_DB()
      .collection('users')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray()

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteUser = async (userId) => {
  try {
    const existUser = await userModel.findOneById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    await userModel.deleteUser(userId)
  } catch (error) {
    throw error
  }
}

const updateUser = async (userId, data, userAvatarFile) => {
  const updateData = { ...data }

  if (userAvatarFile) {
    updateData.avatar = userAvatarFile.path
  }

  // Sử dụng updateOne để cập nhật người dùng
  const result = await userModel.updateUser(userId, updateData)

  if (result.matchedCount === 0) {
    throw new Error('User not found')
  }

  const updatedUser = await userModel.findOneById(userId)
  return updatedUser
}

export const userServices = {
  login, register, refreshToken, update, getAllUsers,
  deleteUser, updateUser
}