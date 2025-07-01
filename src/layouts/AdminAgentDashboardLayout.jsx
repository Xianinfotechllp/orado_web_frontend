import TopNavbar from "../components/AgentAdminDashboard/common/TopNavbar";
import DispatchSidebar from "../components/AgentAdminDashboard/DispatchSidebar";
import AgentStatusPanel from "../components/AgentAdminDashboard/AgentStatusPanel";
import MapView from "../components/AgentAdminDashboard/MapView";

const AdminAgentDashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <DispatchSidebar />

        {/* Center Map */}
        <MapView />

        {/* Right Sidebar */}
        <AgentStatusPanel />
      </div>
    </div>
  );
};

export default AdminAgentDashboardLayout;
