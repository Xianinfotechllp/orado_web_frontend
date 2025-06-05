// src/pages/Admin/AdminDashboard.jsx

import React, { useState } from 'react';
import {
  FiChevronDown, FiChevronUp, FiUser, FiSettings,
  FiClipboard, FiHome, FiLogOut, FiPieChart
} from 'react-icons/fi';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';

const SidebarItem = ({ title, icon, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-sm w-full">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-4 py-3 hover:bg-[#f16a4e] transition-all duration-200 text-white font-medium rounded-lg mx-2 ${
          open ? 'bg-[#f16a4e]' : ''
        }`}
      >
        <span className="flex items-center gap-3">{icon}{title}</span>
        {children && (open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />)}
      </button>
      <div
        className={`ml-6 bg-white text-gray-800 overflow-hidden transition-all duration-300 rounded-lg mt-1 ${
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
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-[20em] bg-[#FC8019] text-white flex flex-col border-r border-orange-200">
        <div className="p-5 border-b border-orange-200 flex items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
            <span className="text-[#FC8019] font-bold text-lg">O</span>
          </div>
          <h2 className="text-xl font-bold">ORADO Admin</h2>
        </div>

        <div className="p-3 border-b border-orange-200">
          <div className="bg-orange-500 text-white rounded-lg p-2 text-center text-sm font-medium">
            Admin Panel
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 py-4 px-2">
          <SidebarItem title="Dashboard" icon={<FiPieChart size={18} />}>
            <Link to="" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Overview
            </Link>
          </SidebarItem>

          <SidebarItem title="Approvals" icon={<FiClipboard size={18} />}>
            <Link to="restaurant-approvals" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Restaurant Approvals
            </Link>
            <Link to="#" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Agent Approvals
            </Link>
          </SidebarItem>

          <SidebarItem title="Restaurants" icon={<FiHome size={18} />}>
            <Link to="restaurant-add" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Add Restaurants
            </Link>
            <Link to="restaurant-edit" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              All Restaurants
            </Link>
            <Link to="restaurant-createmenu" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Create Menu
            </Link>
            <Link to="restaurant-permission" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Restaurant permission
            </Link>
          </SidebarItem>

          <SidebarItem title="Agents" icon={<FiUser size={18} />}>
            <Link to="#" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              View Agents
            </Link>
            <Link to="#" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Assign Projects
            </Link>
          </SidebarItem>

          <SidebarItem title="Settings" icon={<FiSettings size={18} />}>
            <Link to="#" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Edit Profile
            </Link>
            <Link to="#" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Change Password
            </Link>
          </SidebarItem>
        </nav>

        <div className="border-t border-orange-200 p-4">
          <div className="flex items-center justify-between text-white hover:bg-orange-500 transition-all duration-200 cursor-pointer rounded-lg p-3">
            <div className="flex items-center">
              <FiLogOut size={18} />
              <span className="ml-3 font-medium">Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Dashboard/>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;