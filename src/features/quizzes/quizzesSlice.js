import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    allQuizzes: [],
    currentQuiz: null,
    quizInteractions: [],
    loading: false,
    error: null
};

// Fetch all quizzes
export const fetchQuizzes = createAsyncThunk('quizzes/fetchQuizzes', async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get('/quizzes/get_all');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

// Get quiz by ID
export const fetchQuizById = createAsyncThunk('quizzes/fetchQuizById', async (quizId, thunkAPI) => {
    try {
        const response = await axiosInstance.get(`/quizzes/get/${quizId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

// Create quiz
export const createQuiz = createAsyncThunk('quizzes/createQuiz', async (data, thunkAPI) => {
    try {
        const response = await axiosInstance.post('/quizzes/create', data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

// Update quiz
export const updateQuiz = createAsyncThunk('quizzes/updateQuiz', async ({ quizId, data }, thunkAPI) => {
    try {
        const response = await axiosInstance.put(`/quizzes/update/${quizId}`, data);
        return { quizId, data: response.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

// Delete quiz
export const deleteQuiz = createAsyncThunk('quizzes/deleteQuiz', async (quizId, thunkAPI) => {
    try {
        const response = await axiosInstance.delete(`/quizzes/delete/${quizId}`);
        return { quizId, data: response.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

// Create quiz interaction (answer)
export const createQuizInteraction = createAsyncThunk('quizzes/createQuizInteraction', async ({ quizId, answerId }, thunkAPI) => {
    try {
        const response = await axiosInstance.post(`/quizzes/interact/${quizId}`, { answer_id: answerId });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

// Get quiz interactions
export const fetchQuizInteractions = createAsyncThunk('quizzes/fetchQuizInteractions', async (quizId, thunkAPI) => {
    try {
        const response = await axiosInstance.get(`/quizzes/interactions/${quizId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

const quizzesSlice = createSlice({
    name: 'quizzes',
    initialState,
    reducers: {
        clearCurrentQuiz: (state) => {
            state.currentQuiz = null;
        },
        clearQuizInteractions: (state) => {
            state.quizInteractions = [];
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all quizzes
            .addCase(fetchQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.allQuizzes = action.payload;
            })
            .addCase(fetchQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch quiz by ID
            .addCase(fetchQuizById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentQuiz = action.payload;
            })
            .addCase(fetchQuizById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create quiz
            .addCase(createQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQuiz.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update quiz
            .addCase(updateQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuiz.fulfilled, (state, action) => {
                state.loading = false;
                // Update the quiz in allQuizzes array
                const index = state.allQuizzes.findIndex(quiz => quiz.id === action.payload.quizId);
                if (index !== -1) {
                    state.allQuizzes[index] = { ...state.allQuizzes[index], ...action.payload.data };
                }
                // Update currentQuiz if it's the same quiz
                if (state.currentQuiz && state.currentQuiz.id === action.payload.quizId) {
                    state.currentQuiz = { ...state.currentQuiz, ...action.payload.data };
                }
            })
            .addCase(updateQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete quiz
            .addCase(deleteQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteQuiz.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the quiz from allQuizzes array
                state.allQuizzes = state.allQuizzes.filter(quiz => quiz.id !== action.payload.quizId);
                // Clear currentQuiz if it's the deleted quiz
                if (state.currentQuiz && state.currentQuiz.id === action.payload.quizId) {
                    state.currentQuiz = null;
                }
            })
            .addCase(deleteQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create quiz interaction
            .addCase(createQuizInteraction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQuizInteraction.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new interaction to quizInteractions array
                state.quizInteractions.push(action.payload);
            })
            .addCase(createQuizInteraction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch quiz interactions
            .addCase(fetchQuizInteractions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizInteractions.fulfilled, (state, action) => {
                state.loading = false;
                state.quizInteractions = action.payload;
            })
            .addCase(fetchQuizInteractions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentQuiz, clearQuizInteractions, clearError } = quizzesSlice.actions;
export default quizzesSlice.reducer;