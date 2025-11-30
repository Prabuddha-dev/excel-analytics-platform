const ExcelData = require('../models/ExcelData');
const AnalysisHistory = require('../models/AnalysisHistory');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Upload and parse Excel file
exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    console.log('Uploaded file:', req.file);

    // Read the uploaded file
    const workbook = XLSX.readFile(req.file.path);
    console.log('Workbook SheetNames:', workbook.SheetNames);
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('Excel data:', data);
    
    if (data.length > 0) {
      // Extract headers (first row)
      const headers = data[0];
      console.log('Headers:', headers);
      
      // Extract data (remaining rows)
      const dataRows = data.slice(1).filter(row => row.length > 0);
      console.log('Data rows:', dataRows);
      
      // Save to database
      const excelData = await ExcelData.create({
        userId: req.user.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        headers: headers,
        data: dataRows,
        size: req.file.size
      });
      
      // Remove the uploaded file
      fs.unlinkSync(req.file.path);
      
      res.status(201).json({
        success: true,
        data: excelData
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Excel file is empty'
      });
    }
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all Excel files for user
exports.getUserFiles = async (req, res) => {
  try {
    const files = await ExcelData.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get specific Excel file
exports.getExcelFile = async (req, res) => {
  try {
    const file = await ExcelData.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Save analysis history
exports.saveAnalysis = async (req, res) => {
  try {
    const { excelDataId, chartType, xAxis, yAxis, chartConfig } = req.body;
    
    const analysis = await AnalysisHistory.create({
      userId: req.user.id,
      excelDataId,
      chartType,
      xAxis,
      yAxis,
      chartConfig
    });
    
    res.status(201).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get analysis history for user
exports.getAnalysisHistory = async (req, res) => {
  try {
    const history = await AnalysisHistory.find({ userId: req.user.id })
      .populate('excelDataId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};