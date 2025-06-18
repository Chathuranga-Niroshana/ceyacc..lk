import React, { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
    return (
        <div className="min-h-screen flex bg-[#F8F8F8] flex-col">
            {!isAuthPage && <Header />}
            <div className={`flex mt-20 flex-1`}>
                {!isAuthPage &&
                    <div className="w-1/4 z-[9]">
                        <Sidebar />
                    </div>
                }
                <div className="flex-grow w-2/4 p-4">
                    <AppContent />
                </div>
                {shouldShowRightSidebar && (
                    <div className="w-1/4">
                        <RightSidebar />
                    </div>
                )}
            </div>
            {!isAuthPage && <Footer />}
        </div>
    );
};

export default DefaultLayout;
