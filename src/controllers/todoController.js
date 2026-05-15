import todoSchema from "../models/todoSchema.js";

export const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const newTodo = await todoSchema.create({
      title: title,
      userId: req.userId,
    });
    return res.status(201).json({
      success: true,
      message: "Todo Created",
      data: newTodo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllTodo = async (req, res) => {
  try {
    const allTodo = await todoSchema.find({ userId: req.userId });
    return res.status(200).json({
      success: true,
      message: "Todo fetched",
      data: allTodo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todoId = req.params.id;
    const newTodo = await todoSchema.findByIdAndUpdate(
      { _id: todoId, userId: req.userId },
      { title },
    );
    if (!newTodo) {
      return res.status(404).send({
        success: false,
        message: "Todo not found",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Todo updated successfully",
        data: newTodo,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const delTodo = await todoSchema.findByIdAndDelete({
      _id: todoId,
      userId: req.userId,
    });
    if (!delTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      data: delTodo,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Todo not deleted",
    });
  }
};

export const paginateTodo = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 3; // 3 todos per page

    // Calculating the skip value
    const skip = (page - 1) * limit;

    // Getting todo with pagination
    const todo = await todoSchema
      .find({ userId: req.userId })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Todos fetched as per query",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


