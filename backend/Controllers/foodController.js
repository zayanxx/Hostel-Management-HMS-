import { Food } from '../Models/Food.js';

// Create a new Food item
export const createFood = async (req, res) => {
  try {
    const { name, description, category, price, isAvailable } = req.body;

    const food = new Food({
      name,
      description,
      category,
      price,
      isAvailable,
    });

    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Food items with optional filtering
export const getAllFoods = async (req, res) => {
  try {
    const { category, isAvailable } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (typeof isAvailable !== 'undefined')
      filters.isAvailable = isAvailable === 'true';

    const foods = await Food.find(filters).sort({ createdAt: -1 });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Food item by its ID
export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Food item
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedFood = await Food.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Food item
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res
      .status(200)
      .json({ message: 'Food item deleted successfully', deletedFood });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};