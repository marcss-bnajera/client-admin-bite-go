import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export const DashboardContainer = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            {/*Navbar*/}
            <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

            <div className="flex flex-1 relative w-full min-h-0">
                {/* Sidebar*/}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Overlay mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <main className="flex-1 p-4 sm:p-6 w-full min-w-0 overflow-y-auto">
                    {/*Children*/}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};