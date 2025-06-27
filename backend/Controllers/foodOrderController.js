import { FoodOrder } from '../Models/FoodOrder.js';
import User from '../Models/User.js';
import Resident from '../Models/Residents.js';

// Create a new Food Order (resident is auto-assigned from req.user)
export const createFoodOrder = async (req, res) => {
  try {
    const { items, paymentStatus, status, deliveredAt } = req.body;
    
    // Ensure the user is authenticated (resident)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Build order data (orderedAt is set by the schema)
    const orderData = {
      resident: req.user._id,
      items,
      paymentStatus: paymentStatus || 'unpaid', // default is "unpaid"
      status: status || 'pending', // default is "pending"
      deliveredAt: deliveredAt || null,
    };

    const foodOrder = new FoodOrder(orderData);
    
    // The pre-validation hook will calculate totalAmount and each item's totalPrice
    await foodOrder.validate();
    await foodOrder.save();
    
    res.status(201).json(foodOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Food Orders with optional filtering (by status, paymentStatus, resident)
export const getAllFoodOrders = async (req, res) => {
  try {
    const { status, paymentStatus, resident } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (paymentStatus) filters.paymentStatus = paymentStatus;
    if (resident) filters.resident = resident;

    const orders = await FoodOrder.find(filters).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Food Order by its ID
export const getFoodOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await FoodOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Food order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Food Order (e.g., to change status or paymentStatus)
export const updateFoodOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedOrder = await FoodOrder.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Food order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Food Order
export const deleteFoodOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await FoodOrder.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Food order not found' });
    }
    res.status(200).json({ message: 'Food order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: My Food Orders (for residents)
export const getMyFoodOrders = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch the user and ensure they are a resident
    const user = await User.findById(userId);
    if (!user || user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied: only residents can view food orders' });
    }

    // Find the corresponding resident record
    const resident = await Resident.findOne({ user: user._id });
    if (!resident) {
      return res.status(404).json({ message: 'Resident profile not found' });
    }

    // Fetch food orders for this resident
    const orders = await FoodOrder.find({ resident: resident._id }).sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    console.error('Get My Food Orders error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch food orders', error: err.message });
  }
};