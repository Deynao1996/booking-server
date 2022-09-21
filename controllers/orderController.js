import Order from '../models/Order.js'

export const createOrder = async (req, res, next) => {
  const newOrder = new Order(req.body)

  try {
    const savedOrder = await newOrder.save()
    res.status(200).json(savedOrder)
  } catch (error) {
    next(error)
  }
}

export const updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json(updatedOrder)
  } catch (error) {
    next(error)
  }
}

export const deleteOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.status(200).json('Order has been removed')
  } catch (error) {
    next(error)
  }
}

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    res.status(200).json(order)
  } catch (error) {
    next(error)
  }
}

export const getAllOrders = async (req, res, next) => {
  const { limit, page = 1, ...rest } = req.query

  try {
    const orders = await Order.find({ ...rest })
      .limit(limit)
      .skip((page - 1) * limit)
    const count = await Order.countDocuments({ ...rest })

    res.status(200).json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    next(error)
  }
}
