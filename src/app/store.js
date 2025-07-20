import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import usersReducer from '../features/users/usersSlice'
import postReducer from '../features/posts/postSlice'
import eventReducer from '../features/events/eventSlice'
import quizzesReducer from '../features/quizzes/quizzesSlice'
import coursesReducer from '../features/courses/coursesSlice'
import examPapersReducer from '../features/examPapers/examPapersSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
        posts: postReducer,
        events: eventReducer,
        quizzes: quizzesReducer,
        courses: coursesReducer,
        examPapers: examPapersReducer
    }
})