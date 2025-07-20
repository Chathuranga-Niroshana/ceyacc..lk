import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    allExamPapers: [],
    currentExamPaper: null,
    loading: false,
    error: null
};

// Fetch all exam papers
export const fetchExamPapers = createAsyncThunk('examPapers/fetchExamPapers', async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get('/exam_papers/get_all');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Get exam paper by ID
export const fetchExamPaperById = createAsyncThunk('examPapers/fetchExamPaperById', async (examPaperId, thunkAPI) => {
    try {
        const response = await axiosInstance.get(`/exam_papers/get/${examPaperId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Create exam paper
export const createExamPaper = createAsyncThunk('examPapers/createExamPaper', async (data, thunkAPI) => {
    try {
        const response = await axiosInstance.post('/exam_papers/create', data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Update exam paper
export const updateExamPaper = createAsyncThunk('examPapers/updateExamPaper', async ({ examPaperId, data }, thunkAPI) => {
    try {
        const response = await axiosInstance.put(`/exam_papers/update/${examPaperId}`, data);
        return { examPaperId, data: response.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Delete exam paper
export const deleteExamPaper = createAsyncThunk('examPapers/deleteExamPaper', async (examPaperId, thunkAPI) => {
    try {
        const response = await axiosInstance.delete(`/exam_papers/delete/${examPaperId}`);
        return { examPaperId, data: response.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const examPapersSlice = createSlice({
    name: 'examPapers',
    initialState,
    reducers: {
        clearCurrentExamPaper: (state) => {
            state.currentExamPaper = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all exam papers
            .addCase(fetchExamPapers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExamPapers.fulfilled, (state, action) => {
                state.loading = false;
                state.allExamPapers = action.payload;
            })
            .addCase(fetchExamPapers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch exam paper by ID
            .addCase(fetchExamPaperById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExamPaperById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentExamPaper = action.payload;
            })
            .addCase(fetchExamPaperById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create exam paper
            .addCase(createExamPaper.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createExamPaper.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createExamPaper.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update exam paper
            .addCase(updateExamPaper.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExamPaper.fulfilled, (state, action) => {
                state.loading = false;
                // Update the exam paper in allExamPapers array
                const index = state.allExamPapers.findIndex(paper => paper.id === action.payload.examPaperId);
                if (index !== -1) {
                    state.allExamPapers[index] = { ...state.allExamPapers[index], ...action.payload.data };
                }
                // Update currentExamPaper if it's the same paper
                if (state.currentExamPaper && state.currentExamPaper.id === action.payload.examPaperId) {
                    state.currentExamPaper = { ...state.currentExamPaper, ...action.payload.data };
                }
            })
            .addCase(updateExamPaper.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete exam paper
            .addCase(deleteExamPaper.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExamPaper.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the exam paper from allExamPapers array
                state.allExamPapers = state.allExamPapers.filter(paper => paper.id !== action.payload.examPaperId);
                // Clear currentExamPaper if it's the deleted paper
                if (state.currentExamPaper && state.currentExamPaper.id === action.payload.examPaperId) {
                    state.currentExamPaper = null;
                }
            })
            .addCase(deleteExamPaper.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentExamPaper, clearError } = examPapersSlice.actions;
export default examPapersSlice.reducer;