import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { uploadExcelFile, setUploadProgress, resetUploadSuccess } from '../../store/slices/excelSlice';
import { openModal, setActiveSection } from '../../store/slices/uiSlice';
import LoadingSpinner from '../UI/LoadingSpinner';
import { showSuccessConfetti } from '../../utils/confetti';

const FileUpload = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading, uploadProgress, uploadSuccess } = useSelector((state) => state.excel);

  // Handle navigation after successful upload
  useEffect(() => {
    if (uploadSuccess) {
      showSuccessConfetti(); 
      // Navigate to analytics section
      dispatch(setActiveSection('analytics'));
      // Reset the success flag
      dispatch(resetUploadSuccess());
    }
  }, [uploadSuccess, dispatch]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!isAuthenticated) {
        dispatch(openModal({ type: 'login' }));
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        console.log('File selected:', file.name, file.type, file.size);
        
        dispatch(uploadExcelFile(file));
        
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          if (progress <= 100) {
            dispatch(setUploadProgress(progress));
          } else {
            clearInterval(interval);
          }
        }, 100);
      }
    },
    [dispatch, isAuthenticated]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  if (!isAuthenticated) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center glass animate-scale-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-600 mb-4">Please login to upload and analyze Excel files</p>
        <button
          onClick={() => dispatch(openModal({ type: 'login' }))}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors btn-hover"
        >
          Login Now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 glass">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 upload-area ${
          isDragActive
            ? 'border-primary-500 bg-primary-20 animate-pulse-gentle'
            : 'border-gray-300 hover:border-primary-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
          <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        {isLoading ? (
          <>
            <p className="text-lg font-medium text-gray-900 mb-2">Uploading File...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{uploadProgress}% Complete</p>
          </>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop the file here' : 'Drag & drop your Excel file here'}
            </p>
            <p className="text-sm text-gray-600 mb-4">or click to browse</p>
            <p className="text-xs text-gray-500">Supported formats: .xlsx, .xls (Max 10MB)</p>
          </>
        )}
      </div>

      {isLoading && (
        <div className="mt-6 flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2 text-gray-600">Processing your file...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;