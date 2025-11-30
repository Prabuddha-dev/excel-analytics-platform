import React, { useState } from 'react';
import ChartControls from './ChartControls';
import ChartDisplay from './ChartDisplay';

const Analytics = () => {
  const [chartConfig, setChartConfig] = useState({
    xAxis: '',
    yAxis: '',
    chartType: 'bar'
  });

  const handleChartConfigChange = (config) => {
    setChartConfig(config);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 glass animate-fade-in-up">
        <ChartControls onChartConfigChange={handleChartConfigChange} />
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 glass animate-fade-in-up">
        <ChartDisplay 
          xAxis={chartConfig.xAxis} 
          yAxis={chartConfig.yAxis} 
          chartType={chartConfig.chartType} 
        />
      </div>
    </div>
  );
};

export default Analytics;