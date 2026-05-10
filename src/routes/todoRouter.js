import express from 'express';
import { createTodo, deleteTodo, getAllTodo, paginateTodo, updateTodo } from '../controllers/todoController.js';
import { hasToken } from '../middleware/hasToken.js';

const todoRoute = express.Router()

todoRoute.post('/create', hasToken, createTodo)
todoRoute.get('/getAll', hasToken, getAllTodo)
todoRoute.put('/update/:id', hasToken, updateTodo)
todoRoute.delete('/delete/:id', hasToken, deleteTodo)
todoRoute.get('/paginate', hasToken, paginateTodo)


export default todoRoute