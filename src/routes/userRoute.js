import express from 'express'
import { login, logout, userRegister } from '../controllers/userController.js'
import { verification } from '../middleware/verifyToken.js'
import {hasToken} from '../middleware/hasToken.js'

export const userRoute = express.Router()

userRoute.post('/register', userRegister)
userRoute.get('/verify', verification)
userRoute.post('/login', login)
userRoute.delete('/logout',hasToken , logout)

