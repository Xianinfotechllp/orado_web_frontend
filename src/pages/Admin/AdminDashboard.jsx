import { TicketCheck } from "lucide-react";
import React, { useState } from "react";
import { FaUserSecret } from "react-icons/fa";
import {
  FiMenu,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiPieChart,
  FiClipboard,
  FiHome,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { Link, Outlet } from "react-router-dom";

const SidebarItem = ({ title, icon, children, hasPermission }) => {
  const [open, setOpen] = useState(false);

  if (!hasPermission) return null;

  return (
    <div className="text-sm w-full">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-4 py-3 hover:bg-[#f16a4e] transition-all duration-200 text-white font-medium rounded-lg mx-2 ${
          open ? "bg-[#f16a4e]" : ""
        }`}
      >
        <span className="flex items-center gap-3">
          {icon}
          {title}
        </span>
        {children &&
          (open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />)}
      </button>
      <div
        className={`ml-6 bg-white text-gray-800 overflow-hidden transition-all duration-300 rounded-lg mt-1 ${
          open ? "max-h-100 py-2" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || [];

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden p-4 bg-[#FC8019] text-white flex justify-between items-center w-full fixed top-0 left-0 z-50">
        <h2 className="text-xl font-bold">ORADO Admin</h2>
        <button onClick={() => setShowSidebar(!showSidebar)}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static z-40 top-0 left-0 h-full w-[20rem] bg-[#FC8019] text-white flex flex-col border-r border-orange-200
        transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0
        transition-transform duration-300 ease-in-out
      `}
      >
        {/* Close Sidebar Button (Mobile) */}
        <div className="flex lg:hidden justify-end p-4">
          <button
            onClick={() => setShowSidebar(false)}
            className="text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Logo */}
        <div className="p-5 border-b border-orange-200 flex items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
            <span className="text-[#FC8019] font-bold text-lg">O</span>
          </div>
          <h2 className="text-xl font-bold">ORADO Admin</h2>
        </div>

        {/* Panel Title */}
        <div className="p-3 border-b border-orange-200">
          <div className="bg-orange-500 text-white rounded-lg p-2 text-center text-sm font-medium">
            Admin Panel
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-1 py-4 px-2 z-200">
          <SidebarItem
            title="Dashboard"
            icon={<FiPieChart size={18} />}
            hasPermission={true} // Always show dashboard
          >
            <Link
              to=""
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Overview
            </Link>
          </SidebarItem>

          <SidebarItem
            title="Approvals"
            icon={<FiClipboard size={18} />}
            hasPermission={
              hasPermission("merchants.manage") ||
              hasPermission("agents.manage")
            }
          >
            {hasPermission("merchants.manage") && (
              <Link
                to="restaurant-approvals"
                className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
              >
                Restaurant Approvals
              </Link>
            )}
            {hasPermission("agents.manage") && (
              <Link
                to="#"
                className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
              >
                Agent Approvals
              </Link>
            )}
          </SidebarItem>

          <SidebarItem
            title="Restaurants"
            icon={<FiHome size={18} />}
            hasPermission={hasPermission("merchants.manage")}
          >
            <Link
              to="restaurant-add"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Add Restaurants
            </Link>
            <Link
              to="restaurant-edit"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              All Restaurants
            </Link>
            <Link
              to="restaurant-createmenu"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Create Menu
            </Link>
            <Link
              to="restaurant-permission"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Restaurant Permission
            </Link>
            <Link
              to="restaurant-commission"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Restaurant Commission
            </Link>
            
            
          </SidebarItem>

          <SidebarItem
            title="Agents"
            icon={<FaUserSecret size={18} />}
            hasPermission={hasPermission("agents.manage")}
          >
            <Link
              to="#"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              View Agents
            </Link>
            <Link
              to="#"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Assign Projects
            </Link>
          </SidebarItem>

          <SidebarItem
            title="Admins"
            icon={<GrUserAdmin size={18} />}
            hasPermission={hasPermission("users.manage")}
          >
            <Link
              to="admin-add"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Add Admins
            </Link>
            <Link
              to="admin-manage"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Manage Admins
            </Link>
          </SidebarItem>

          <SidebarItem 
            title="Customers" 
            icon={<GrUserAdmin size={18}/>}
            hasPermission={hasPermission('users.manage')}
          >
            <Link to="user-managemnet" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Customer Management
            </Link>
            <Link to="admin-customer-chat" className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded">
              Customer Chats
            </Link>
          </SidebarItem>

          <SidebarItem
            title="Ticket"
            icon={<TicketCheck size={18} />}
            hasPermission={hasPermission("support.manage")}
          >
            <Link
              to="admin-ticket"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Ticket Manager
            </Link>
          </SidebarItem>

          <SidebarItem
            title="Settings"
            icon={<FiSettings size={18} />}
            hasPermission={true} // Always show settings
          >
            <Link
              to="#"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Edit Profile
            </Link>
            <Link
              to="#"
              className="block py-2 px-4 hover:text-[#FC8019] hover:bg-orange-50 rounded"
            >
              Change Password
            </Link>
          </SidebarItem>
        </nav>

        {/* Logout */}
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
      <div className="flex-1 overflow-y-auto bg-gray-50 pt-16 lg:pt-0">
        <div className="p-5">
          <div className="bg-white rounded-xl shadow-sm ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
