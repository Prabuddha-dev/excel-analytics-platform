const mongoose = require('mongoose');

const analysisHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  excelDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelData',
    required: true
  },
  chartType: {
    type: String,
    required: true
  },
  xAxis: {
    type: String,
    required: true
  },
  yAxis: {
    type: String,
    required: true
  },
  chartConfig: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalysisHistory', analysisHistorySchema);