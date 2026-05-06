import express from 'express'
import { login, userRegister } from '../controllers/userController.js'
import { verification } from '../middleware/verifyToken.js'

export const userRoute = express.Router()

userRoute.post('/register', userRegister)
userRoute.get('/verify', verification)
userRoute.post('/login', login)

