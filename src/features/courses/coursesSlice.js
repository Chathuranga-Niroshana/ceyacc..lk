import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    allCourses: [],
    currentCourse: null,
    loading: false,
    error: null
};

// Fetch all courses
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get('/courses/get_all');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

// Get course by ID
export const fetchCourseById = createAsyncThunk('courses/fetchCourseById', async (courseId, thunkAPI) => {
    try {
        const response = await axiosInstance.get(`/courses/get/${courseId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

// Create course
export const createCourse = createAsyncThunk('courses/createCourse', async (data, thunkAPI) => {
    try {
        const response = await axiosInstance.post('/courses/create', data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

// Update course
export const updateCourse = createAsyncThunk('courses/updateCourse', async ({ courseId, data }, thunkAPI) => {
    try {
        const response = await axiosInstance.put(`/courses/update/${courseId}`, data);
        return { courseId, data: response.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

// Delete course
export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (courseId, thunkAPI) => {
    try {
        const response = await axiosInstance.delete(`/courses/delete/${courseId}`);
        return { courseId, data: response.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all courses
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.allCourses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch course by ID
            .addCase(fetchCourseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create course
            .addCase(createCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update course
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.loading = false;
                // Update the course in allCourses array
                const index = state.allCourses.findIndex(course => course.id === action.payload.courseId);
                if (index !== -1) {
                    state.allCourses[index] = { ...state.allCourses[index], ...action.payload.data };
                }
                // Update currentCourse if it's the same course
                if (state.currentCourse && state.currentCourse.id === action.payload.courseId) {
                    state.currentCourse = { ...state.currentCourse, ...action.payload.data };
                }
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete course
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the course from allCourses array
                state.allCourses = state.allCourses.filter(course => course.id !== action.payload.courseId);
                // Clear currentCourse if it's the deleted course
                if (state.currentCourse && state.currentCourse.id === action.payload.courseId) {
                    state.currentCourse = null;
                }
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentCourse, clearError } = coursesSlice.actions;
export default coursesSlice.reducer;