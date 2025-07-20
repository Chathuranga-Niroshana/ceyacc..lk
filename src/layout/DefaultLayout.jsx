import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import routes from "../routes";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";

const AppContent = () => {
    return (
        <div className="px-4">
            <Suspense fallback={<div className="flex justify-center items-center h-screen"><CircularProgress color="success" /></div>}>
                <Routes>
                    {routes.map(
                        (route, idx) =>
                            route.element && (
                                <Route
                                    key={idx + 1}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    element={<route.element />}
                                />
                            )
                    )}
                </Routes>
            </Suspense>
        </div>
    );
};

const DefaultLayout = () => {
    const location = useLocation();
    const authRoutes = ["/login", "/register", "/forgot-password"];
    const isAuthPage = authRoutes.includes(location.pathname);
    const isCourseDetailsPage = /^\/courses\/\d+$/.test(location.pathname);
    const shouldShowRightSidebar = !isAuthPage && !isCourseDetailsPage;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    return (
        <div className="min-h-screen flex bg-[#F8F8F8] flex-col">
            {!isAuthPage && <Header />}
            <div className={`flex mt-20 flex-1`}>
                {/* Sidebar: only show on md and up */}
                {!isAuthPage && (
                    <div className="w-1/4 hidden md:block z-[9]">
                        <Sidebar />
                    </div>
                )}
                {/* App Content: full width on md and below, shrink on lg+ */}
                <div className={`flex-grow p-4 ${!isAuthPage ? 'w-full md:w-2/4 transition-all duration-300' : ''}`}>
                    <AppContent />
                </div>
                {/* RightSidebar: only show on lg and up */}
                {shouldShowRightSidebar && (
                    <div className="w-1/4 hidden lg:block">
                        <RightSidebar />
                    </div>
                )}
            </div>
            {!isAuthPage && <Footer />}
        </div>
    );
};

export default DefaultLayout;
