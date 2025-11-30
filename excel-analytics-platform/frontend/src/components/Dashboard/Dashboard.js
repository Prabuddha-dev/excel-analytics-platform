import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, setActiveSection } from '../../store/slices/uiSlice';
import { getUserFiles, getAnalysisHistory } from '../../store/slices/excelSlice';
import FileUpload from './FileUpload';
import DataTable from './DataTable';
import ChartControls from './ChartControls';
import ChartDisplay from './ChartDisplay';
import History from './History';
import AdminPanel from '../Admin/AdminPanel';
import Analytics from './Analytics'; 

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { activeSection } = useSelector((state) => state.ui);
  const { files, analysisHistory } = useSelector((state) => state.excel);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserFiles());
      dispatch(getAnalysisHistory());
    }
  }, [dispatch, isAuthenticated]);

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      dispatch(openModal({ type: 'login' }));
      return;
    }
    dispatch(setActiveSection('upload'));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'upload':
        return <FileUpload />;
      case 'analytics':
        return <Analytics />;
      case 'history':
        return <History />;
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 card-hover glass">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{files.length}</p>
                    <p className="text-gray-600">Uploaded Files</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 card-hover glass">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{analysisHistory.length}</p>
                    <p className="text-gray-600">Analysis Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 card-hover glass">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">100%</p>
                    <p className="text-gray-600">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8 animate-fade-in-up glass">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleUploadClick}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-20 transition-colors text-center btn-hover"
                >
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="font-medium text-gray-700">Upload Excel File</p>
                  <p className="text-sm text-gray-500">Start analyzing your data</p>
                </button>

                <button
                  onClick={() => dispatch(setActiveSection('history'))}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-20 transition-colors text-center btn-hover"
                >
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-gray-700">View History</p>
                  <p className="text-sm text-gray-500">Check previous analyses</p>
                </button>
              </div>
            </div>

            {analysisHistory.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 glass">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Analysis</h2>
                <div className="space-y-3">
                  {analysisHistory.slice(0, 5).map((analysis) => (
                    <div key={analysis._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white/50">
                      <div>
                        <p className="font-medium text-gray-800 capitalize">{analysis.chartType} Chart</p>
                        <p className="text-sm text-gray-600">
                          {analysis.xAxis} vs {analysis.yAxis}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="flex-1 p-6 bg-transparent">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {activeSection === 'dashboard' && 'Dashboard'}
          {activeSection === 'upload' && 'Upload Excel File'}
          {activeSection === 'analytics' && 'Data Analytics'}
          {activeSection === 'history' && 'Analysis History'}
          {activeSection === 'admin' && 'Admin Panel'}
        </h1>
        <p className="text-gray-600">
          {activeSection === 'dashboard' && 'Welcome to your analytics dashboard'}
          {activeSection === 'upload' && 'Upload and analyze your Excel files'}
          {activeSection === 'analytics' && 'Create beautiful charts from your data'}
          {activeSection === 'history' && 'View your analysis history'}
          {activeSection === 'admin' && 'Manage users and system settings'}
        </p>
      </div>

      {renderSection()}
    </div>
  );
};

export default Dashboard;