import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import usersReducer from '../features/users/usersSlice'
import postReducer from '../features/posts/postSlice'
import eventReducer from '../features/events/eventSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
        posts: postReducer,
        events: eventReducer
    }
})