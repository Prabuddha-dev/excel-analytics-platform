import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Scatter, Radar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const ChartDisplay = ({ xAxis, yAxis, chartType }) => {
  const { currentFile } = useSelector((state) => state.excel);
  const chartRef = useRef();

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    if (!currentFile || !currentFile.headers || !currentFile.data || !xAxis || !yAxis) {
      return null;
    }

    const xIndex = currentFile.headers.indexOf(xAxis);
    const yIndex = currentFile.headers.indexOf(yAxis);

    if (xIndex === -1 || yIndex === -1) {
      return null;
    }

    const labels = [];
    const data = [];

    currentFile.data.forEach((row) => {
      if (row[xIndex] !== undefined && row[yIndex] !== undefined) {
        labels.push(row[xIndex]);
        const numericValue = parseFloat(row[yIndex]);
        data.push(isNaN(numericValue) ? 0 : numericValue);
      }
    });

    const backgroundColors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
    ];

    return {
      labels,
      datasets: [
        {
          label: yAxis,
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        },
      ],
    };
  }, [currentFile, xAxis, yAxis]);

  // Memoize chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${yAxis} by ${xAxis}`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxis,
        },
      },
      x: {
        title: {
          display: true,
          text: xAxis,
        },
      },
    } : undefined,
  }), [xAxis, yAxis, chartType]);

  // Memoize download function
  const downloadChart = useCallback(async (format) => {
    try {
      if (!chartRef.current) {
        console.error('Chart reference not found');
        return;
      }

      // Get the canvas element
      const canvas = chartRef.current.canvas;
      
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `chart-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'pdf') {
        const pdf = new jsPDF('landscape');
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`chart-${Date.now()}.pdf`);
      }
    } catch (error) {
      console.error('Error downloading chart:', error);
    }
  }, []);

  // Render chart component based on type
  const renderChart = useCallback(() => {
    if (!chartData) return null;

    const chartProps = {
      ref: chartRef,
      data: chartData,
      options: chartOptions,
      redraw: false, // Set to false to prevent unnecessary redraws
    };

    switch (chartType) {
      case 'bar':
        return <Bar {...chartProps} />;
      case 'line':
        return <Line {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      case 'doughnut':
        return <Doughnut {...chartProps} />;
      case 'scatter':
        return <Scatter {...chartProps} />;
      case 'radar':
        return <Radar {...chartProps} />;
      default:
        return <Bar {...chartProps} />;
    }
  }, [chartData, chartOptions, chartType]);

  if (!currentFile || !currentFile.headers || !currentFile.data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Please select a file and configure chart options</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Please select valid X and Y axes</p>
        <p className="text-sm text-gray-500 mt-2">
          Available headers: {currentFile.headers.join(', ')}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Current selection: X={xAxis || 'None'}, Y={yAxis || 'None'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Chart Preview</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => downloadChart('png')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Download PNG
          </button>
          <button
            onClick={() => downloadChart('pdf')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="h-96">
        {renderChart()}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Chart Type: {chartType}</p>
        <p>X-Axis: {xAxis}</p>
        <p>Y-Axis: {yAxis}</p>
        <p>Data Points: {chartData.datasets[0].data.length}</p>
      </div>
    </div>
  );
};

export default React.memo(ChartDisplay);