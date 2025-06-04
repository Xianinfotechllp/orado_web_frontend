// src/pages/Admin/AdminDashboard.jsx

import React, { useState } from 'react';
import {
  FiChevronDown, FiChevronUp, FiUser, FiSettings,
  FiClipboard, FiHome, FiLogOut
} from 'react-icons/fi';
import { Link, Outlet, useLocation } from 'react-router-dom';

const SidebarItem = ({ title, icon, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-sm w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 hover:bg-[#f16a4e] transition-all duration-200 text-white font-medium"
      >
        <span className="flex items-center gap-2">{icon}{title}</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      <div
        className={`ml-8 bg-white text-gray-800 overflow-hidden transition-all duration-300 ${
          open ? 'max-h-40 py-2' : 'max-h-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

function AdminDashboard() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-[#EA4424] shadow-2xl text-white flex flex-col">
        <h2 className="text-2xl font-bold p-5 border-b border-white">ORADO Admin</h2>

        <nav className="flex-1 overflow-y-auto space-y-2 py-4">
          <SidebarItem title="Approvals" icon={<FiClipboard />}>
            <Link to="restaurant-approvals" className="block py-1 pl-2 hover:text-[#EA4424] hover:underline">
              Restaurant Approvals
            </Link>
            <p className="py-1 pl-2 hover:text-[#EA4424] hover:underline cursor-pointer">Agent Approvals</p>
          </SidebarItem>

          <SidebarItem title="Restaurant Management" icon={<FiHome />}>
            <Link to="restaurant-add" className="block py-1 pl-2 hover:text-[#EA4424] hover:underline">
            Add Restaurants
            </Link>
            
            <Link to="restaurant-edit" className="block py-1 pl-2 hover:text-[#EA4424] hover:underline">
            All Restaurants 
            </Link>
          </SidebarItem>

          <SidebarItem title="Agent Management" icon={<FiUser />}>
            <p className="py-1 pl-2 hover:text-[#EA4424] hover:underline cursor-pointer">View Agents</p>
            <p className="py-1 pl-2 hover:text-[#EA4424] hover:underline cursor-pointer">Assign Projects</p>
          </SidebarItem>

          <SidebarItem title="Profile Management" icon={<FiSettings />}>
            <p className="py-1 pl-2 hover:text-[#EA4424] hover:underline cursor-pointer">Edit Profile</p>
            <p className="py-1 pl-2 hover:text-[#EA4424] hover:underline cursor-pointer">Change Password</p>
          </SidebarItem>
        </nav>

        <div className="border-t border-white p-4 flex items-center justify-between text-white hover:bg-red-600 transition-all duration-200 cursor-pointer">
          <FiLogOut />
          <span className="ml-2 font-semibold">Logout</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
