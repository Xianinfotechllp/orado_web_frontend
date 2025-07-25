import { TicketCheck, Receipt, SquareGanttChart } from "lucide-react";
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
  FiSettings,
  FiList,
  FiCalendar,
  FiShoppingBag,
  FiUsers,
  FiTag,
  FiMail,
  FiLayers,
  FiImage
} from "react-icons/fi";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdDeliveryDining, MdOutlineLocalOffer } from "react-icons/md";
import { FaChevronRight, FaChevronDown as FaChevronDownIcon } from "react-icons/fa";
import { GrUserAdmin, GrUser } from "react-icons/gr";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";



function AdminDashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || [];

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
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

        <Sidebar/>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 pt-16 lg:pt-0">
        <div className="p-5">
          <div className="bg-white rounded-xl shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;