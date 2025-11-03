import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/merchant/Dashboard/sidebar/Sidebar";
import DashboardHeader from "../components/merchant/Dashboard/DashboardHeader";

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header at the top */}
        <DashboardHeader onMenuToggle={() => setMobileSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
