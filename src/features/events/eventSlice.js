import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    allEvents: [],
    loading: false,
    error: null
};
export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get('/events/get_all');
        console.log(response.data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const createEvent = createAsyncThunk('events/createEvent', async (data, thunkAPI) => {
    try {
        const response = await axiosInstance.post('/events/create', data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})


export const deletePost = createAsyncThunk('events/deletePost', async (id, thunkAPI) => {
    try {
        const response = await axiosInstance.delete(`/events/delete/${id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})



const eventSlice = createSlice({
    name: 'events',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.allEvents = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export default eventSlice.reducer;
