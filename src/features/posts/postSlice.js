import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    allPosts: [],
    loading: false,
    error: null
};
export const fetchPost = createAsyncThunk('post/fetchPost', async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get('/posts/get_all');
        console.log(response.data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

// export const fetchStudents = createAsyncThunk('post/fetchStudents', async (_, thunkAPI) => {
//     try {
//         const response = await axiosInstance.get('/posts/students');
//         return response.data;
//     } catch (error) {
//         return thunkAPI.rejectWithValue(error.message)
//     }
// })

// export const fetchFollowing = createAsyncThunk('post/fetchFollowing', async (_, thunkAPI) => {
//     try {
//         // const response = await axiosInstance.get('/posts/following');
//         // return response.data
//         return students;
//     } catch (error) {
//         return thunkAPI.rejectWithValue(error.message)
//     }
// })

// export const fetchMostEngagingUsers = createAsyncThunk('post/fetchMostEngagingUsers', async (_, thunkAPI) => {
//     try {
//         // const response = await axiosInstance.get('/posts/most-engaging');
//         return mostEngagingUsers
//     } catch (error) {
//         return thunkAPI.rejectWithValue(error.message)
//     }
// })

const postSlice = createSlice({
    name: 'posts',
    initialState,
    // reducers: {
    //     clearStudents(state) {
    //         state.students = [];
    //     },
    //     clearTeachers(state) {
    //         state.teachers = [];
    //     },
    //     clearFollowing(state) {
    //         state.following = [];
    //     },
    // },
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
// export const {
//     clearFollowing,
//     clearStudents,
//     clearTeachers,
// } = postSlice.actions

export default postSlice.reducer;
