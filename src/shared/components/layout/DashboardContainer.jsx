import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { Outlet } from "react-router-dom";

export const DashboardContainer = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/*Navbar*/}
            <Navbar />

            <div className="flex flex-1">
                {/* Sidebar*/}
                <Sidebar />

                <main className="flex-1 p-6">
                    {/*Children*/}
                    <Outlet />

                </main>
            </div>
        </div>
    )
}