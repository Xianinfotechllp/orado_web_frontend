import TopNavbar from "../components/AgentAdminDashboard/common/TopNavbar";
import DispatchSidebar from "../components/AgentAdminDashboard/DispatchSidebar";
import AgentStatusPanel from "../components/AgentAdminDashboard/AgentStatusPanel";
import MapView from "../components/AgentAdminDashboard/MapView";
import { useEffect ,useState} from "react";
import axios from "axios";
const AdminAgentDashboardLayout = () => {

   const [agents, setAgents] = useState([]);
 const [selectedOrder, setSelectedOrder] = useState(null);

   const [selectedAgent, setSelectedAgent] = useState(null);


 

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/agent/list");
        if (res.data.messageType === "success") {
          setAgents(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch agent list", error);
      }
    };

    fetchAgents();
  }, []);


  const handleOrderSelect = (order) => {
    console.log(order)
    setSelectedOrder(order);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
 <DispatchSidebar 
          onOrderSelect={handleOrderSelect} 
          selectedOrder={selectedOrder}
        />

        {/* Center Map */}
       <MapView agents={agents}  selectedAgent={selectedAgent} selectedOrder={selectedOrder}/>

        {/* Right Sidebar */}
        <AgentStatusPanel    onAgentSelect={setSelectedAgent}  />
      </div>
    </div>
  );
};

export default AdminAgentDashboardLayout;
