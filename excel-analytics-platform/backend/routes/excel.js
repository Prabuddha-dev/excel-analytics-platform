const express = require('express');
const { 
  uploadExcel, 
  getUserFiles, 
  getExcelFile, 
  saveAnalysis, 
  getAnalysisHistory 
} = require('../controllers/excelController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const AnalysisHistory = require('../models/AnalysisHistory'); // Add this import

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadExcel);
router.get('/files', protect, getUserFiles);
router.get('/files/:id', protect, getExcelFile);
router.post('/analysis', protect, saveAnalysis);
router.get('/analysis', protect, getAnalysisHistory);

// Add this DELETE endpoint
router.delete('/analysis/:id', protect, async (req, res) => {
  try {
    const analysis = await AnalysisHistory.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }
    
    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this analysis'
      });
    }
    
    await AnalysisHistory.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: { _id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;