import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Get token/user from localStorage if available
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

const initialState = {
    currentUser: user ? JSON.parse(user) : null,
    token: token || null,
    loading: false,
    error: null,
};

// REGISTER
export const register = createAsyncThunk(
    'auth/register',
    async (formData, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/users/register', formData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message);
        }
    }
);

// LOGIN
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            const { token, user, success } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { token, user, success };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.detail || error.message);
        }
    }
);

// LOGOUT
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return true;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.currentUser = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.currentUser = action.payload.user;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            })

            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Registration failed';
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.token = null;
                state.currentUser = null;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
