import React, { useState } from 'react';
import AppLayout from '../../components/userProfile/layout/AppLayout';
import Sidebar from '../../components/userProfile/navigation/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { Menu } from 'lucide-react'; 
import Logout from '../../components/userProfile/logut/Logout';

const LogoutPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Navbar />
      <AppLayout>
        <div className="flex flex-col md:flex-row">
          {/* Mobile menu button */}
          <div className="md:hidden flex justify-between items-center p-4 bg-white border-b">
            <h2 className="text-xl font-semibold">Log Out</h2>
            <button onClick={() => setShowSidebar(!showSidebar)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar - hidden on small screens unless toggled */}
          <div
            className={`${
              showSidebar ? 'block' : 'hidden'
            } md:block w-full md:w-64 border-r bg-white`}
          >
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 md:p-6">
            <Logout />
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default LogoutPage;
