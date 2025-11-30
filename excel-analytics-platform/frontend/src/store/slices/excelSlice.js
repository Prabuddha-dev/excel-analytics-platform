import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { excelAPI } from '../../utils/api';

// Async thunks
export const uploadExcelFile = createAsyncThunk(
  'excel/upload',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await excelAPI.uploadFile(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'File upload failed'
      );
    }
  }
);

export const getUserFiles = createAsyncThunk(
  'excel/getFiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await excelAPI.getFiles();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get files'
      );
    }
  }
);

export const getExcelFile = createAsyncThunk(
  'excel/getFile',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await excelAPI.getFile(fileId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get file'
      );
    }
  }
);

export const saveAnalysis = createAsyncThunk(
  'excel/saveAnalysis',
  async (analysisData, { rejectWithValue }) => {
    try {
      const response = await excelAPI.saveAnalysis(analysisData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to save analysis'
      );
    }
  }
);

export const getAnalysisHistory = createAsyncThunk(
  'excel/getAnalysisHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await excelAPI.getAnalysisHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get analysis history'
      );
    }
  }
);

// Add this for delete functionality
export const deleteAnalysis = createAsyncThunk(
  'excel/deleteAnalysis',
  async (analysisId, { rejectWithValue }) => {
    try {
      // You'll need to create this API endpoint in your backend
      const response = await excelAPI.deleteAnalysis(analysisId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete analysis'
      );
    }
  }
);

const excelSlice = createSlice({
  name: 'excel',
  initialState: {
    files: [],
    currentFile: null,
    analysisHistory: [],
    isLoading: false,
    error: null,
    uploadProgress: 0,
    uploadSuccess: false,
    deleteLoading: false, // Added for delete loading state
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
    },
    resetUploadSuccess: (state) => {
      state.uploadSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadExcelFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadProgress = 0;
        state.uploadSuccess = false;
      })
      .addCase(uploadExcelFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadProgress = 100;
        state.uploadSuccess = true;
        state.files.unshift(action.payload.data);
      })
      .addCase(uploadExcelFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
        state.uploadSuccess = false;
      })
      // Get user files
      .addCase(getUserFiles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload.data;
      })
      .addCase(getUserFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get specific file
      .addCase(getExcelFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExcelFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentFile = action.payload.data;
      })
      .addCase(getExcelFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Save analysis
      .addCase(saveAnalysis.fulfilled, (state, action) => {
        state.analysisHistory.unshift(action.payload.data);
      })
      // Get analysis history
      .addCase(getAnalysisHistory.fulfilled, (state, action) => {
        state.analysisHistory = action.payload.data;
      })
      // Delete analysis
      .addCase(deleteAnalysis.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteAnalysis.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove the deleted analysis from the history
        state.analysisHistory = state.analysisHistory.filter(
          analysis => analysis._id !== action.payload.data._id
        );
      })
      .addCase(deleteAnalysis.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  setUploadProgress, 
  clearCurrentFile, 
  resetUploadSuccess
} = excelSlice.actions;
export default excelSlice.reducer;