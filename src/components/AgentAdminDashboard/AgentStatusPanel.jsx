import { useState, useEffect } from "react";
import axios from "axios";

const AgentStatusPanel = () => {
  const [agents, setAgents] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredAgents = agents.filter((agent) => {
    const matchesTab = activeTab === "All" || agent.status === activeTab;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Free":
        return "bg-green-100 text-green-800";
      case "Busy":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case "Free":
        return "bg-green-500";
      case "Busy":
        return "bg-yellow-500";
      case "Inactive":
        return "bg-gray-400";
      default:
        return "bg-blue-400";
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
        <h2 className="font-bold text-lg text-white">Agent Status</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search agents..."
            className="pl-8 pr-4 py-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-2.5 top-1.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-3 pb-2 border-b">
        {["All", "Free", "Busy", "Inactive"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-sm font-medium rounded-full mr-2 transition-colors ${
              activeTab === tab
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Agent List */}
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {filteredAgents.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">No agents found</p>
            <p className="text-xs text-gray-500">Try changing filters or search</p>
          </div>
        ) : (
          filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                  {agent.name.charAt(0)}
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getDotColor(agent.status)}`}
                ></span>
              </div>

              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{agent.name}</p>
                <p className="text-sm text-gray-500">{agent.phone}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-xs text-gray-500">
                    Status: {agent.status}
                  </span>
                  <span className="text-xs text-gray-500">| {agent.currentStatus}</span>
                </div>
              </div>

              <div className="flex items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(agent.status)}`}
                >
                  {agent.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-500">
        {filteredAgents.length}{" "}
        {filteredAgents.length === 1 ? "agent" : "agents"} shown
      </div>
    </div>
  );
};

export default AgentStatusPanel;
