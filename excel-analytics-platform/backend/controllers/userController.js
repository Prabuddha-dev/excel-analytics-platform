const User = require('../models/User');
const ExcelData = require('../models/ExcelData');

// Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user stats (admin only)
exports.getUserStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const fileCount = await ExcelData.countDocuments();
    const totalStorage = await ExcelData.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$size' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        userCount,
        activeUsers,
        fileCount,
        totalStorage: totalStorage[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user status (admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};