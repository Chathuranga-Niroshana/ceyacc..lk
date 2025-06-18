import React from "react";

const Home = React.lazy(() => import('./pages/home/Home'))
const Login = React.lazy(() => import("./pages/auth/Login"))
const ForgetPassword = React.lazy(() => import("./pages/auth/ForgetPassword"))
const Register = React.lazy(() => import("./pages/auth/Register"))
const Library = React.lazy(() => import("./pages/library/Library"))
const Users = React.lazy(() => import("./pages/users/Users"))
const CreateContent = React.lazy(() => import("./pages/createContent/CreateContent"))
const LiveClasses = React.lazy(() => import("./pages/liveClasses/LiveClasses"))
const Quizzes = React.lazy(() => import("./pages/quizzes/Quizzes"))
const Courses = React.lazy(() => import("./pages/courses/Courses"))
const CourseDetails = React.lazy(() => import("./pages/courses/CourseDetails"))
const ExamPapers = React.lazy(() => import("./pages/examPapers/ExamPapers"))
const Events = React.lazy(() => import("./pages/events/Events"))
const Jobs = React.lazy(() => import("./pages/jobs/Jobs"))
const Settings = React.lazy(() => import("./pages/settings/Settings"))
const UserProfile = React.lazy(() => import("./pages/userProfile/UserProfile"))

const routes = [
    { path: '/', exact: true, name: 'Home', element: Home },
    { path: '/login', exact: true, name: 'Login', element: Login },
    { path: '/register', exact: true, name: 'Register', element: Register },
    { path: '/forgot-password', exact: true, name: 'ForgetPassword', element: ForgetPassword },
    { path: '/library', exact: true, name: 'Library', element: Library },
    { path: '/users', exact: true, name: 'Users', element: Users },
    { path: '/users/:id', exact: true, name: 'Users', element: UserProfile },
    { path: '/create-content', exact: true, name: 'CreateContent', element: CreateContent },
    { path: '/live', exact: true, name: 'LiveClasses', element: LiveClasses },
    { path: '/quizzes', exact: true, name: 'Quizzes', element: Quizzes },
    { path: '/courses', exact: true, name: 'Courses', element: Courses },
    { path: '/courses/:id', exact: true, name: 'Course Details', element: CourseDetails },
    { path: '/papers', exact: true, name: 'ExamPapers', element: ExamPapers },
    { path: '/events', exact: true, name: 'Events', element: Events },
    { path: '/jobs', exact: true, name: 'Jobs', element: Jobs },
    { path: '/settings', exact: true, name: 'Settings', element: Settings },
]

export default routes;