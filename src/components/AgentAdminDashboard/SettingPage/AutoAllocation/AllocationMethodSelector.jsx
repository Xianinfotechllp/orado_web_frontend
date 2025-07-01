import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Layout,
  RefreshCw,
  MapPin,
  ListOrdered,
  CheckCircle2,
  Save,
} from "lucide-react";

const AllocationMethodSelector = ({
  allocationMethod,
  setAllocationMethod,
  initialConfigs,
  onSave,
}) => {
  const [methodConfigs, setMethodConfigs] = useState({
    one_by_one: {
      taskAllocationPriority: ["captive", "freelancer"],
      requestExpirySec: 30,
      numberOfRetries: 0,
      startAllocationBeforeTaskTimeMin: 5,
      autoCancelSettings: {
        enabled: false,
        timeForAutoCancelOnFailSec: 0,
      },
      considerAgentRating: false,
    },
    send_to_all: {
      maxAgents: 500,
      requestExpirySec: 30,
      numberOfRetries: 0,
      startAllocationBeforeTaskTimeMin: 5,
    },
    batch_wise: {
      batchSize: 5,
      batchLimit: 5,
      requestExpirySec: 30,
      numberOfRetries: 0,
      startAllocationBeforeTaskTimeMin: 5,
    },
  
    nearest_available: {
      taskAllocationPriority: ["captive", "freelancer"],
      calculateByRoadDistance: false,
      maximumRadiusKm: 10,
      startAllocationBeforeTaskTimeMin: 5,
      autoCancelSettings: {
        enabled: false,
        timeForAutoCancelOnFailSec: 0,
      },
      considerAgentRating: false,
    },
    
      fifo: {
    considerAgentRating: false,
    startAllocationBeforeTaskTimeMin: 0,
    startRadiusKm: 5,
    radiusIncrementKm: 1,
    maximumRadiusKm: 10,
    batchProcessingTimeSec: 30,
    requestTimeSec: 30,
    maximumBatchSize: 5,
    maximumBatchLimit: 10,
    enableClubbing: false,
    clubbingSettings: {
      deliveryDistanceKm: 5,
      orderThresholdTimeSec: 120,
      additionalTasksToBeClubbed: 2,
    },
  },

    round_robin: {
      taskAllocationPriority: ["captive", "freelancer"],
      maxTasksAllowed: 20,
      radiusKm: 10,
      startAllocationBeforeTaskTimeMin: 0,
      samePickupRadiusMeters: 50,
      waitingTimeForPickupMin: 0,
      waitingTimeForDeliveryMin: 0,
      parkingTimeAtPickupMin: 0,
      shortestEtaIgnoreMin: 0,
      shortestTimeSlaMin: 30,
      maxPoolTimeDifferenceMin: 30,
      maxPoolTaskCount: 999999,
      assignTaskToOffDutyAgents: false,
      considerThisDistanceAsMaxDistance: true,
      restartAllocationOnDecline: true,
      autoCancelSettings: {
        enabled: false,
        timeForAutoCancelOnFailSec: 0,
      },
      considerAgentRating: false,
      shortestTimeSlaEnabled: false, // Added this to control the toggle
    },
  });

  useEffect(() => {
    if (initialConfigs && Object.keys(initialConfigs).length > 0) {
      setMethodConfigs((prev) => ({
        ...prev,
        ...initialConfigs,
      }));
    }
  }, [initialConfigs]);

  const handleConfigChange = (methodId, field, value, nestedField = null) => {
    setMethodConfigs((prev) => {
      if (nestedField) {
        return {
          ...prev,
          [methodId]: {
            ...prev[methodId],
            [nestedField]: {
              ...prev[methodId][nestedField],
              [field]: value,
            },
          },
        };
      } else {
        return {
          ...prev,
          [methodId]: {
            ...prev[methodId],
            [field]: value,
          },
        };
      }
    });
  };

  const methods = [
    {
      id: "one_by_one",
      name: "One By One",
      icon: <User size={20} className="text-blue-500" />,
      description: "Tasks are allocated to agents one at a time until accepted",
    },
    {
      id: "send_to_all",
      name: "Send To All",
      icon: <Users size={20} className="text-green-500" />,
      description: "Task is sent to all available agents simultaneously",
    },
    {
      id: "batch_wise",
      name: "Batch Wise",
      icon: <Layout size={20} className="text-purple-500" />,
      description:
        "Tasks are allocated in predefined batches to groups of agents",
    },
    {
      id: "round_robin",
      name: "Round Robin",
      icon: <RefreshCw size={20} className="text-orange-500" />,
      description: "Tasks are distributed evenly among all available agents",
    },
    {
      id: "nearest_available",
      name: "Nearest Available",
      icon: <MapPin size={20} className="text-red-500" />,
      description:
        "Tasks are allocated based on agent proximity to task location",
    },
    {
      id: "fifo",
      name: "FIFO",
      icon: <ListOrdered size={20} className="text-yellow-500" />,
      description:
        "First come, first served allocation based on task creation time",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">
          Task Allocation Method
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Select and configure how tasks should be automatically allocated to
          agents
        </p>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-3">Available Methods</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md group ${
                allocationMethod === method.id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => setAllocationMethod(method.id)}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2.5 rounded-lg ${
                    allocationMethod === method.id
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600 group-hover:bg-blue-50"
                  }`}
                >
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900">{method.name}</h5>
                    {allocationMethod === method.id && (
                      <CheckCircle2
                        size={18}
                        className="text-blue-500 ml-2 flex-shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {method.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {allocationMethod && (
        <div className="p-5 border rounded-lg bg-white shadow-sm space-y-5">
          <h4 className="font-medium text-gray-800">
            Configuration for{" "}
            {methods.find((m) => m.id === allocationMethod)?.name}
          </h4>

          {/* One By One Method Configuration */}
          {allocationMethod === "one_by_one" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Allocation Priority
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  value={methodConfigs.one_by_one.priority || "Default"}
                  onChange={(e) =>
                    handleConfigChange("one_by_one", "priority", e.target.value)
                  }
                >
                  <option value="Default">Default</option>
                  <option value="Capitive Agent then Freelancer Agent">
                    Capitive Agent then Freelancer Agent
                  </option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Expiry (seconds)
                </label>
                <input
                  type="number"
                  value={methodConfigs.one_by_one.requestExpirySec || 0}
                  onChange={(e) =>
                    handleConfigChange(
                      "one_by_one",
                      "requestExpirySec",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Retries
                </label>
                <input
                  type="number"
                  value={methodConfigs.one_by_one.numberOfRetries || 0}
                  onChange={(e) =>
                    handleConfigChange(
                      "one_by_one",
                      "numberOfRetries",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Allocation Before Task Time (minutes)
                </label>
                <input
                  type="number"
                  value={
                    methodConfigs.one_by_one.startAllocationBeforeTaskTimeMin ||
                    5
                  }
                  onChange={(e) =>
                    handleConfigChange(
                      "one_by_one",
                      "startAllocationBeforeTaskTimeMin",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Auto Cancel Settings
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically cancel unassigned tasks
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.one_by_one.autoCancelSettings?.enabled ||
                      false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "one_by_one",
                        "enabled",
                        e.target.checked,
                        "autoCancelSettings"
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {methodConfigs.one_by_one.autoCancelSettings?.enabled && (
                <div className="mb-6 pl-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time for Auto Cancel on Allocation Fail (seconds)
                  </label>
                  <input
                    type="number"
                    value={
                      methodConfigs.one_by_one.autoCancelSettings
                        ?.timeForAutoCancelOnFailSec || 0
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "one_by_one",
                        "timeForAutoCancelOnFailSec",
                        parseInt(e.target.value) || 0,
                        "autoCancelSettings"
                      )
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Consider Agent Rating
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Prioritize higher rated agents
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.one_by_one.considerAgentRating || false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "one_by_one",
                        "considerAgentRating",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </>
          )}

          {/* Nearest Available Method Configuration (existing code remains the same) */}
          {allocationMethod === "nearest_available" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Allocation Priority
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  value={
                    methodConfigs.nearest_available.taskAllocationPriority?.join(
                      " "
                    ) || "captive freelancer"
                  }
                  onChange={(e) =>
                    handleConfigChange(
                      "nearest_available",
                      "taskAllocationPriority",
                      e.target.value.split(" ")
                    )
                  }
                >
                  <option value="captive freelancer">
                    Captive Agent then Freelancer Agent
                  </option>
                  <option value="freelancer captive">
                    Freelancer Agent then Captive Agent
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Calculate By Road Distance
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Uses actual road distance instead of straight-line
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.nearest_available.calculateByRoadDistance ||
                      false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "nearest_available",
                        "calculateByRoadDistance",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Radius (km)
                </label>
                <input
                  type="number"
                  value={methodConfigs.nearest_available.maximumRadiusKm || 0}
                  onChange={(e) =>
                    handleConfigChange(
                      "nearest_available",
                      "maximumRadiusKm",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Allocation Before Task Time (minutes)
                </label>
                <input
                  type="number"
                  value={
                    methodConfigs.nearest_available
                      .startAllocationBeforeTaskTimeMin || 5
                  }
                  onChange={(e) =>
                    handleConfigChange(
                      "nearest_available",
                      "startAllocationBeforeTaskTimeMin",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Auto Cancel Settings
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically cancel unassigned tasks
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.nearest_available.autoCancelSettings
                        ?.enabled || false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "nearest_available",
                        "enabled",
                        e.target.checked,
                        "autoCancelSettings"
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {methodConfigs.nearest_available.autoCancelSettings?.enabled && (
                <div className="mb-6 pl-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time for Auto Cancel on Allocation Fail (seconds)
                  </label>
                  <input
                    type="number"
                    value={
                      methodConfigs.nearest_available.autoCancelSettings
                        ?.timeForAutoCancelOnFailSec || 0
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "nearest_available",
                        "timeForAutoCancelOnFailSec",
                        parseInt(e.target.value) || 0,
                        "autoCancelSettings"
                      )
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Consider Agent Rating
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Prioritize higher rated agents
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.nearest_available.considerAgentRating ||
                      false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "nearest_available",
                        "considerAgentRating",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </>
          )}

          {allocationMethod === "send_to_all" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Allocation Priority
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  value={
                    methodConfigs.send_to_all.taskAllocationPriority?.join(
                      " "
                    ) || "captive freelancer"
                  }
                  onChange={(e) =>
                    handleConfigChange(
                      "send_to_all",
                      "taskAllocationPriority",
                      e.target.value.split(" ")
                    )
                  }
                >
                  <option value="captive freelancer">
                    Captive Agent then Freelancer Agent
                  </option>
                  <option value="freelancer captive">
                    Freelancer Agent then Captive Agent
                  </option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Agents
                </label>
                <input
                  type="number"
                  value={methodConfigs.send_to_all.maxAgents || 500}
                  onChange={(e) =>
                    handleConfigChange(
                      "send_to_all",
                      "maxAgents",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maximum number of agents to send the task to (1-500)
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Expiry (seconds)
                </label>
                <input
                  type="number"
                  value={methodConfigs.send_to_all.requestExpirySec || 30}
                  onChange={(e) =>
                    handleConfigChange(
                      "send_to_all",
                      "requestExpirySec",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Allocation Before Task Time (minutes)
                </label>
                <input
                  type="number"
                  value={
                    methodConfigs.send_to_all
                      .startAllocationBeforeTaskTimeMin || 5
                  }
                  onChange={(e) =>
                    handleConfigChange(
                      "send_to_all",
                      "startAllocationBeforeTaskTimeMin",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Auto Cancel Settings
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically cancel unassigned tasks
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.send_to_all.autoCancelSettings?.enabled ||
                      false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "send_to_all",
                        "enabled",
                        e.target.checked,
                        "autoCancelSettings"
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {methodConfigs.send_to_all.autoCancelSettings?.enabled && (
                <div className="mb-6 pl-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time for Auto Cancel on Allocation Fail (seconds)
                  </label>
                  <input
                    type="number"
                    value={
                      methodConfigs.send_to_all.autoCancelSettings
                        ?.timeForAutoCancelOnFailSec || 0
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "send_to_all",
                        "timeForAutoCancelOnFailSec",
                        parseInt(e.target.value) || 0,
                        "autoCancelSettings"
                      )
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.send_to_all.considerAgentRating || false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "send_to_all",
                        "considerAgentRating",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  {/* <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div> */}
                </label>
              </div>
            </>
          )}

          {allocationMethod === "round_robin" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Allocation Priority
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  value={
                    methodConfigs.round_robin.taskAllocationPriority?.join(
                      " "
                    ) || "captive freelancer"
                  }
                  onChange={(e) =>
                    handleConfigChange(
                      "round_robin",
                      "taskAllocationPriority",
                      e.target.value.split(" ")
                    )
                  }
                >
                  <option value="captive freelancer">
                    Captive Agent then Freelancer Agent
                  </option>
                  <option value="freelancer captive">
                    Freelancer Agent then Captive Agent
                  </option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Tasks Allowed per Agent
                </label>
                <input
                  type="number"
                  value={methodConfigs.round_robin.maxTasksAllowed || 20}
                  onChange={(e) =>
                    handleConfigChange(
                      "round_robin",
                      "maxTasksAllowed",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Radius (km)
                </label>
                <input
                  type="number"
                  value={methodConfigs.round_robin.radiusKm || 10}
                  onChange={(e) =>
                    handleConfigChange(
                      "round_robin",
                      "radiusKm",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Allocation Before Task Time (minutes)
                </label>
                <input
                  type="number"
                  value={
                    methodConfigs.round_robin
                      .startAllocationBeforeTaskTimeMin || 0
                  }
                  onChange={(e) =>
                    handleConfigChange(
                      "round_robin",
                      "startAllocationBeforeTaskTimeMin",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Assign Task to Off-Duty Agents
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Include agents who are currently off-duty
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.round_robin.assignTaskToOffDutyAgents ||
                      false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "round_robin",
                        "assignTaskToOffDutyAgents",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Consider Radius as Max Distance
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Strictly enforce the radius limit
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.round_robin
                        .considerThisDistanceAsMaxDistance ?? true
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "round_robin",
                        "considerThisDistanceAsMaxDistance",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Restart Allocation on Decline
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Re-allocate task if agent declines
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.round_robin.restartAllocationOnDecline ??
                      true
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "round_robin",
                        "restartAllocationOnDecline",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Shortest Time SLA
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Prioritize agents with shortest ETA
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.round_robin.shortestTimeSlaEnabled || false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "round_robin",
                        "shortestTimeSlaEnabled",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {methodConfigs.round_robin.shortestTimeSlaEnabled && (
                <>
                  <div className="mb-6 pl-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shortest Time SLA (minutes)
                    </label>
                    <input
                      type="number"
                      value={methodConfigs.round_robin.shortestTimeSlaMin || 30}
                      onChange={(e) =>
                        handleConfigChange(
                          "round_robin",
                          "shortestTimeSlaMin",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>

                  <div className="mb-6 pl-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Radius for Same Pickup (meters)
                    </label>
                    <input
                      type="number"
                      value={
                        methodConfigs.round_robin.samePickupRadiusMeters || 50
                      }
                      onChange={(e) =>
                        handleConfigChange(
                          "round_robin",
                          "samePickupRadiusMeters",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>

                  <div className="mb-6 pl-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waiting Time for Pickup (minutes)
                    </label>
                    <input
                      type="number"
                      value={
                        methodConfigs.round_robin.waitingTimeForPickupMin || 0
                      }
                      onChange={(e) =>
                        handleConfigChange(
                          "round_robin",
                          "waitingTimeForPickupMin",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>

                  <div className="mb-6 pl-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waiting Time for Delivery (minutes)
                    </label>
                    <input
                      type="number"
                      value={
                        methodConfigs.round_robin.waitingTimeForDeliveryMin || 0
                      }
                      onChange={(e) =>
                        handleConfigChange(
                          "round_robin",
                          "waitingTimeForDeliveryMin",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>

                  <div className="mb-6 pl-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parking Time at Pickup (minutes)
                    </label>
                    <input
                      type="number"
                      value={
                        methodConfigs.round_robin.parkingTimeAtPickupMin || 0
                      }
                      onChange={(e) =>
                        handleConfigChange(
                          "round_robin",
                          "parkingTimeAtPickupMin",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>

                  <div className="mb-6 pl-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shortest ETA Ignore Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={
                        methodConfigs.round_robin.shortestEtaIgnoreMin || 0
                      }
                      onChange={(e) =>
                        handleConfigChange(
                          "round_robin",
                          "shortestEtaIgnoreMin",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                </>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Pool Task Time Difference (minutes)
                </label>
                <input
                  type="number"
                  value={
                    methodConfigs.round_robin.maxPoolTimeDifferenceMin || 30
                  }
                  onChange={(e) =>
                    handleConfigChange(
                      "round_robin",
                      "maxPoolTimeDifferenceMin",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Pool Task Count
                </label>
                <input
                  type="number"
                  value={methodConfigs.round_robin.maxPoolTaskCount || 999999}
                  onChange={(e) =>
                    handleConfigChange(
                      "round_robin",
                      "maxPoolTaskCount",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>

              <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Auto Cancel Settings
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically cancel unassigned tasks
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.round_robin.autoCancelSettings?.enabled ||
                      false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "round_robin",
                        "enabled",
                        e.target.checked,
                        "autoCancelSettings"
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {methodConfigs.round_robin.autoCancelSettings?.enabled && (
                <div className="mb-6 pl-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time for Auto Cancel on Allocation Fail (seconds)
                  </label>
                  <input
                    type="number"
                    value={
                      methodConfigs.round_robin.autoCancelSettings
                        ?.timeForAutoCancelOnFailSec || 0
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "round_robin",
                        "timeForAutoCancelOnFailSec",
                        parseInt(e.target.value) || 0,
                        "autoCancelSettings"
                      )
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Consider Agent Rating
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Prioritize higher rated agents
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      methodConfigs.round_robin.considerAgentRating || false
                    }
                    onChange={(e) =>
                      handleConfigChange(
                        "round_robin",
                        "considerAgentRating",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </>
          )}







{allocationMethod === "fifo" && (
  <>
    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <h4 className="text-sm font-medium text-gray-700">Consider Agent Rating</h4>
        <p className="text-xs text-gray-500 mt-1">Prioritize higher rated agents</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={methodConfigs.fifo.considerAgentRating || false}
          onChange={(e) =>
            handleConfigChange(
              "fifo",
              "considerAgentRating",
              e.target.checked
            )
          }
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Start Allocation Before Task Time (minutes)
      </label>
      <input
        type="number"
        value={methodConfigs.fifo.startAllocationBeforeTaskTimeMin || 0}
        onChange={(e) =>
          handleConfigChange(
            "fifo",
            "startAllocationBeforeTaskTimeMin",
            parseInt(e.target.value) || 0
          )
        }
        className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
        min="0"
      />
    </div>

    <div className="space-y-4 mb-6 p-4 border border-gray-200 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700">Distance Settings</h4>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Radius (km)
        </label>
        <input
          type="number"
          value={methodConfigs.fifo.startRadiusKm || 5}
          onChange={(e) =>
            handleConfigChange(
              "fifo",
              "startRadiusKm",
              parseFloat(e.target.value) || 0
            )
          }
          className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
          min="0"
          step="0.1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Radius Increment (km)
        </label>
        <input
          type="number"
          value={methodConfigs.fifo.radiusIncrementKm || 1}
          onChange={(e) =>
            handleConfigChange(
              "fifo",
              "radiusIncrementKm",
              parseFloat(e.target.value) || 0
            )
          }
          className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
          min="0"
          step="0.1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Maximum Radius (km)
        </label>
        <input
          type="number"
          value={methodConfigs.fifo.maximumRadiusKm || 10}
          onChange={(e) =>
            handleConfigChange(
              "fifo",
              "maximumRadiusKm",
              parseFloat(e.target.value) || 0
            )
          }
          className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
          min="0"
          step="0.1"
        />
      </div>
    </div>

    <div className="space-y-4 mb-6 p-4 border border-gray-200 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700">Time Settings</h4>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Batch Processing Time (seconds)
        </label>
        <p className="text-xs text-gray-500 mb-2">Time after which system generates a new batch</p>
        <input
          type="number"
          value={methodConfigs.fifo.batchProcessingTimeSec || 30}
          onChange={(e) =>
            handleConfigChange(
              "fifo",
              "batchProcessingTimeSec",
              parseInt(e.target.value) || 0
            )
          }
          className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Request Time (seconds)
        </label>
        <p className="text-xs text-gray-500 mb-2">Time available to the Agent for accepting the task</p>
        <input
          type="number"
          value={methodConfigs.fifo.requestTimeSec || 30}
          onChange={(e) =>
            handleConfigChange(
              "fifo",
              "requestTimeSec",
              parseInt(e.target.value) || 0
            )
          }
          className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
          min="0"
        />
      </div>
    </div>

    <div className="space-y-4 mb-6 p-4 border border-gray-200 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700">Batch Settings</h4>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Maximum Batch Size
        </label>
        <p className="text-xs text-gray-500 mb-2">Maximum count of Agents who will be sent a request in an attempt</p>
        <input
          type="number"
          value={methodConfigs.fifo.maximumBatchSize || 5}
          onChange={(e) =>
            handleConfigChange(
              "fifo",
              "maximumBatchSize",
              parseInt(e.target.value) || 0
            )
          }
          className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
          min="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Maximum Batch Limit
        </label>
        <p className="text-xs text-gray-500 mb-2">Number of batches formed in one try</p>
        <input
          type="number"
          value={methodConfigs.fifo.maximumBatchLimit || 10}
          onChange={(e) =>
            handleConfigChange(
              "fifo",
              "maximumBatchLimit",
              parseInt(e.target.value) || 0
            )
          }
          className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
          min="1"
        />
      </div>
    </div>

    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <h4 className="text-sm font-medium text-gray-700">Enable Clubbing</h4>
        <p className="text-xs text-gray-500 mt-1">
          This feature allows you to club tasks which have same address (for pickup or delivery tasks)
          and connected tasks which have same pickup
        </p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={methodConfigs.fifo.enableClubbing || false}
          onChange={(e) =>
            handleConfigChange(
              "fifo",
              "enableClubbing",
              e.target.checked
            )
          }
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>

    {methodConfigs.fifo.enableClubbing && (
      <div className="space-y-4 mb-6 p-4 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700">Clubbing Settings</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Distance (km)
          </label>
          <input
            type="number"
            value={methodConfigs.fifo.clubbingSettings?.deliveryDistanceKm || 5}
            onChange={(e) =>
              handleConfigChange(
                "fifo",
                "deliveryDistanceKm",
                parseFloat(e.target.value) || 0,
                "clubbingSettings"
              )
            }
            className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Threshold Time (seconds)
          </label>
          <input
            type="number"
            value={methodConfigs.fifo.clubbingSettings?.orderThresholdTimeSec || 120}
            onChange={(e) =>
              handleConfigChange(
                "fifo",
                "orderThresholdTimeSec",
                parseInt(e.target.value) || 0,
                "clubbingSettings"
              )
            }
            className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Additional Tasks to be Clubbed
          </label>
          <input
            type="number"
            value={methodConfigs.fifo.clubbingSettings?.additionalTasksToBeClubbed || 2}
            onChange={(e) =>
              handleConfigChange(
                "fifo",
                "additionalTasksToBeClubbed",
                parseInt(e.target.value) || 0,
                "clubbingSettings"
              )
            }
            className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border focus:ring-blue-500 focus:border-blue-500"
            min="1"
          />
        </div>
      </div>
    )}
  </>
)}


















          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() =>
                onSave({
                  ...methodConfigs,
                  method: allocationMethod,
                })
              }
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save size={18} className="mr-2" />
              Save Allocation Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationMethodSelector;
