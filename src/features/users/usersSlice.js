import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mostEngagingUsers } from '../../../database/mostEngagingUsers';
import { students, teachers } from '../../../database/users';

const initialState = {
    mostEngagingUsers: [],
    students: [],
    teachers: [],
    following: [],
    loading: false,
    error: null
};
export const fetchTeachers = createAsyncThunk('users/fetchTeachers', async (_, thunkAPI) => {
    try {
        return teachers
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const fetchStudents = createAsyncThunk('users/fetchStudents', async (_, thunkAPI) => {
    try {
        return students
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const fetchFollowing = createAsyncThunk('users/fetchFollowing', async (_, thunkAPI) => {
    try {
        return students
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const fetchMostEngagingUsers = createAsyncThunk('users/fetchMostEngagingUsers', async (_, thunkAPI) => {
    try {
        return mostEngagingUsers
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearStudents(state) {
            state.students = [];
        },
        clearTeachers(state) {
            state.teachers = [];
        },
        clearFollowing(state) {
            state.following = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMostEngagingUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMostEngagingUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.mostEngagingUsers = action.payload;
            })
            .addCase(fetchMostEngagingUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchTeachers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeachers.fulfilled, (state, action) => {
                state.loading = false;
                state.teachers = action.payload;
            })
            .addCase(fetchTeachers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchFollowing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFollowing.fulfilled, (state, action) => {
                state.loading = false;
                state.following = action.payload;
            })
            .addCase(fetchFollowing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const {
    clearFollowing,
    clearStudents,
    clearTeachers,
} = usersSlice.actions

export default usersSlice.reducer;
