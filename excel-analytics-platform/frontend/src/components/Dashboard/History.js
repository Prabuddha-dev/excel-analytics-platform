import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalysisHistory, deleteAnalysis } from '../../store/slices/excelSlice';

const History = () => {
  const dispatch = useDispatch();
  const { analysisHistory, isLoading, deleteLoading } = useSelector((state) => state.excel);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAnalysisHistory());
    }
  }, [dispatch, isAuthenticated]);

  const handleDeleteAnalysis = (analysisId, analysisName) => {
    console.log('Attempting to delete analysis:', analysisId);
    if (window.confirm(`Are you sure you want to delete the analysis "${analysisName}"? This action cannot be undone.`)) {
      dispatch(deleteAnalysis(analysisId))
        .unwrap()
        .then((result) => {
          console.log('Analysis deleted successfully:', result);
        })
        .catch((error) => {
          console.error('Error deleting analysis:', error);
          
          // More specific error messages
          if (error.includes('Not authorized')) {
            alert('You are not authorized to delete this analysis.');
          } else if (error.includes('not found')) {
            alert('Analysis not found. It may have already been deleted.');
          } else {
            alert('Failed to delete analysis: ' + (error.message || 'Unknown error'));
          }
        });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center glass animate-scale-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-600">Please login to view your analysis history</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center glass">
        <p className="text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (analysisHistory.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center glass animate-scale-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
        <p className="text-gray-600">You haven't created any analyses yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden glass animate-fade-in-up">
      <div className="px-6 py-4 border-b border-gray-200/50">
        <h3 className="text-lg font-medium text-gray-900">Analysis History</h3>
        <p className="text-sm text-gray-600">Your previously created charts and analyses</p>
      </div>

      <div className="divide-y divide-gray-200/50">
        {analysisHistory.map((analysis) => (
          <div key={analysis._id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 capitalize">
                  {analysis.chartType} Chart - {analysis.excelDataId?.originalName || 'Unknown File'}
                </h4>
                <p className="text-sm text-gray-600">
                  {analysis.xAxis} vs {analysis.yAxis}
                </p>
                <p className="text-xs text-gray-500">
                  Created {new Date(analysis.createdAt).toLocaleDateString()} at{' '}
                  {new Date(analysis.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button 
                  onClick={() => handleDeleteAnalysis(analysis._id, `${analysis.chartType} Chart`)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors btn-hover"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;