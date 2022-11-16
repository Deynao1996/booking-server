import Order from '../models/Order.js'

export const createOrder = async (req, res, next) => {
  const newOrder = new Order(req.body)

  try {
    const createdOrder = await newOrder.save()
    res
      .status(200)
      .json({ data: createdOrder, successMsg: 'Order has been created!' })
  } catch (error) {
    next(error)
  }
}

export const updateOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json('Order has been updated!')
  } catch (error) {
    next(error)
  }
}

export const deleteOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.status(200).json(req.params.id + ' ' + 'Order has been removed')
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
  const { limit, page = 1, createdAt = 1, ...rest } = req.query
  let findConfig = rest

  if (rest.reserveRooms)
    findConfig = { ...rest, reserveRooms: JSON.parse(rest.reserveRooms) }

  try {
    const orders = await Order.find({ ...findConfig })
      .sort({ createdAt })
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
