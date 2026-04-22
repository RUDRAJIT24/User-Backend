import express from 'express'
import { userRegister } from '../controllers/userController.js'

export const userRoute = express.Router()

userRoute.post('/register', userRegister)

