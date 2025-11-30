import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExcelFile, saveAnalysis } from '../../store/slices/excelSlice';

const ChartControls = ({ onChartConfigChange }) => {
  const dispatch = useDispatch();
  const { files, currentFile } = useSelector((state) => state.excel);
  const [selectedFile, setSelectedFile] = useState('');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0]._id);
      dispatch(getExcelFile(files[0]._id));
    }
  }, [files, selectedFile, dispatch]);

  useEffect(() => {
    if (currentFile && currentFile.headers) {
      console.log('Current file data:', currentFile);
      if (currentFile.headers.length >= 2) {
        const newXAxis = currentFile.headers[0];
        const newYAxis = currentFile.headers[1];
        setXAxis(newXAxis);
        setYAxis(newYAxis);
        
        // Notify parent about the initial configuration
        if (onChartConfigChange) {
          onChartConfigChange({
            xAxis: newXAxis,
            yAxis: newYAxis,
            chartType: 'bar'
          });
        }
      }
    }
  }, [currentFile, onChartConfigChange]);

  useEffect(() => {
    // Notify parent component about chart configuration changes
    if (onChartConfigChange && xAxis && yAxis) {
      onChartConfigChange({ xAxis, yAxis, chartType });
    }
  }, [xAxis, yAxis, chartType, onChartConfigChange]);

  const handleFileChange = (e) => {
    const fileId = e.target.value;
    setSelectedFile(fileId);
    dispatch(getExcelFile(fileId));
  };

  const handleAxisChange = (axisType, value) => {
    if (axisType === 'x') {
      setXAxis(value);
    } else {
      setYAxis(value);
    }
  };

  const handleChartTypeChange = (value) => {
    setChartType(value);
  };

  const handleGenerateChart = () => {
    if (!selectedFile || !xAxis || !yAxis) {
      console.log('Missing required fields:', { selectedFile, xAxis, yAxis });
      return;
    }

    console.log('Generating chart with:', { selectedFile, xAxis, yAxis, chartType });

    const analysisData = {
      excelDataId: selectedFile,
      chartType,
      xAxis,
      yAxis,
      chartConfig: {},
    };

    dispatch(saveAnalysis(analysisData));
  };

  if (files.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">No files available. Please upload an Excel file first.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Chart Configuration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
          <select
            value={selectedFile}
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50"
          >
            {files.map((file) => (
              <option key={file._id} value={file._id}>
                {file.originalName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis</label>
          <select
            value={xAxis}
            onChange={(e) => handleAxisChange('x', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50"
          >
            <option value="">Select X-Axis</option>
            {currentFile?.headers?.map((header, index) => (
              <option key={index} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis</label>
          <select
            value={yAxis}
            onChange={(e) => handleAxisChange('y', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50"
          >
            <option value="">Select Y-Axis</option>
            {currentFile?.headers?.map((header, index) => (
              <option key={index} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => handleChartTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="doughnut">Doughnut Chart</option>
            <option value="scatter">Scatter Plot</option>
            <option value="radar">Radar Chart</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerateChart}
        disabled={!selectedFile || !xAxis || !yAxis}
        className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
      >
        Generate Chart
      </button>

      <div className="mt-4 text-sm text-gray-600">
        <p>Current selection: X={xAxis || 'None'}, Y={yAxis || 'None'}, Type={chartType}</p>
      </div>
    </div>
  );
};

export default ChartControls;