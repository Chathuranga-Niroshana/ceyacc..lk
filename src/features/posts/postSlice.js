import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    allPosts: [],
    loading: false,
    error: null
};
export const fetchPost = createAsyncThunk('posts/fetchPost', async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get('/posts/get_all');
        console.log(response.data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const createPost = createAsyncThunk('posts/createPost', async (data, thunkAPI) => {
    try {
        const response = await axiosInstance.post('/posts/create', data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const reactToPost = createAsyncThunk('posts/reactToPost', async (data, thunkAPI) => {
    try {
        const response = await axiosInstance.post('/reaction/create', data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})



export const deletePost = createAsyncThunk('posts/deletePost', async (id, thunkAPI) => {
    try {
        const response = await axiosInstance.delete(`/posts/delete/${id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})



const postSlice = createSlice({
    name: 'posts',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPost.fulfilled, (state, action) => {
                state.loading = false;
                state.allPosts = action.payload;
            })
            .addCase(fetchPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export default postSlice.reducer;
