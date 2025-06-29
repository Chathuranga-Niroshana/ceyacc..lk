import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
};


// register
export const register = createAsyncThunk('auth/register', async (_, thunkAPI) => {
    try {
        // const response = await 
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.currentUser = action.payload;
        },
        logout(state) {
            state.currentUser = null;
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
