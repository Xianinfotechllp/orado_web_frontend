import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';

import MilestoneRuleForm from './MilestoneRuleForm';
import MilestoneRulesTable from './MilestoneRulesTable';
import AgentProgressCard from './AgentProgressCard';

const MitlestonManagment = () => {
  const [rules, setRules] = useState([
    {
      id: 1,
      levelName: 'Bronze',
      minOrders: 50,
      minDeliveryDistance: 100,
      customerRatingsThreshold: 4.0,
      minWorkingHours: 160,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      notificationEnabled: true,
      abTestGroup: 'A',
    },
    {
      id: 2,
      levelName: 'Silver',
      minOrders: 150,
      minDeliveryDistance: 300,
      customerRatingsThreshold: 4.2,
      minWorkingHours: 200,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      notificationEnabled: true,
      abTestGroup: 'B',
    },
    {
      id: 3,
      levelName: 'Gold',
      minOrders: 300,
      minDeliveryDistance: 500,
      customerRatingsThreshold: 4.5,
      minWorkingHours: 240,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: false,
      notificationEnabled: false,
      abTestGroup: 'A',
    },
  ]);

  const [editingRule, setEditingRule] = useState(null);

  const handleSaveRule = (rule) => {
    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? { ...rule, id: editingRule.id } : r));
      setEditingRule(null);
    } else {
      const newRule = { ...rule, id: Date.now() };
      setRules([...rules, newRule]);
    }
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
  };

  const handleDeleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleDuplicateRule = (rule) => {
    const duplicatedRule = {
      ...rule,
      id: Date.now(),
      levelName: `${rule.levelName} Copy`,
    };
    setRules([...rules, duplicatedRule]);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
  };

  const handleRefresh = () => {
    console.log('Refreshing milestone rules...');
  };

  return (
    <div className="flex h-screen bg-gray-50">
    
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                    🏆 Agent Milestone Settings
                  </h1>
                  <p className="text-gray-600">
                    Manage delivery agent milestone rules and performance tiers (Bronze, Silver, Gold, etc.)
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleRefresh}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => setEditingRule(null)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Milestone Rule</span>
                  </button>
                </div>
              </div>
            </header>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Progress Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AgentProgressCard
                  agentName="John Doe"
                  currentLevel="Bronze"
                  nextLevel="Silver"
                  progress={75}
                  ordersCompleted={38}
                  ordersRequired={50}
                />
                <AgentProgressCard
                  agentName="Sarah Smith"
                  currentLevel="Silver"
                  nextLevel="Gold"
                  progress={45}
                  ordersCompleted={68}
                  ordersRequired={150}
                />
                <AgentProgressCard
                  agentName="Mike Johnson"
                  currentLevel="Gold"
                  nextLevel="Platinum"
                  progress={20}
                  ordersCompleted={60}
                  ordersRequired={300}
                />
                <AgentProgressCard
                  agentName="Emma Wilson"
                  currentLevel="Bronze"
                  nextLevel="Silver"
                  progress={90}
                  ordersCompleted={45}
                  ordersRequired={50}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <MilestoneRuleForm
                  rule={editingRule}
                  onSave={handleSaveRule}
                  onCancel={handleCancelEdit}
                />
              </div>
              <div className="lg:col-span-2">
                <MilestoneRulesTable
                  rules={rules}
                  onEdit={handleEditRule}
                  onDelete={handleDeleteRule}
                  onDuplicate={handleDuplicateRule}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MitlestonManagment;