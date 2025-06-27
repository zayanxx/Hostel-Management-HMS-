import Suggestion from '../Models/Suggestion.js';
import User from '../Models/User.js';
import Resident from '../Models/Residents.js';

export const createSuggestion = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user || user.role !== 'resident') {
      return res.status(403).json({ message: 'Only residents can submit suggestions' });
    }

    const resident = await Resident.findOne({ user: user._id });
    if (!resident) return res.status(404).json({ message: 'Resident profile not found' });

    const { name, subject, content } = req.body;

    const suggestion = new Suggestion({
      resident: resident._id,
      name,
      email: user.email,
      subject,
      content,
    });

    await suggestion.save();
    res.status(201).json(suggestion);
  } catch (error) {
    console.error('Suggestion creation failed:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllSuggestions = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    const suggestions = await Suggestion.find(filters).sort({ createdAt: -1 });
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSuggestionById = async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });
    res.status(200).json(suggestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSuggestion = async (req, res) => {
  try {
    const updated = await Suggestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Suggestion not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSuggestion = async (req, res) => {
  try {
    const deleted = await Suggestion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Suggestion not found' });
    res.status(200).json({ message: 'Suggestion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySuggestions = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user || user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const resident = await Resident.findOne({ user: user._id });
    if (!resident) return res.status(404).json({ message: 'Resident profile not found' });

    const suggestions = await Suggestion.find({ resident: resident._id }).sort({ createdAt: -1 });
    res.status(200).json(suggestions);
  } catch (err) {
    console.error('Get My Suggestions error:', err.message);
    res.status(500).json({ message: 'Failed to fetch suggestions', error: err.message });
  }
};