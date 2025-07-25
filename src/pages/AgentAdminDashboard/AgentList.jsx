// pages/AgentList.jsx
import React, { useState } from 'react';

const dummyAgents = [
  { id: '101', fullName: 'Alice Johnson', image: '', phoneNumber: '9876543210', email: 'alice@example.com', status: 'Online' },
  { id: '102', fullName: 'Bob Smith', image: '', phoneNumber: '9123456780', email: 'bob@example.com', status: 'Offline' },
  { id: '103', fullName: 'Charlie Brown', image: '', phoneNumber: '9988776655', email: 'charlie@example.com', status: 'Online' },
  { id: '104', fullName: 'Diana Prince', image: '', phoneNumber: '9001122334', email: 'diana@example.com', status: 'Offline' },
  { id: '105', fullName: 'Evan Wright', image: '', phoneNumber: '9334455667', email: 'evan@example.com', status: 'Online' },
  { id: '106', fullName: 'Fiona Green', image: '', phoneNumber: '9556677889', email: 'fiona@example.com', status: 'Online' },
  { id: '107', fullName: 'George Harris', image: '', phoneNumber: '9112233445', email: 'george@example.com', status: 'Offline' },
  { id: '108', fullName: 'Hannah Clark', image: '', phoneNumber: '9445566778', email: 'hannah@example.com', status: 'Online' },
  { id: '109', fullName: 'Ian Miller', image: '', phoneNumber: '9778899001', email: 'ian@example.com', status: 'Offline' },
  { id: '110', fullName: 'Jessica Lee', image: '', phoneNumber: '9887766554', email: 'jessica@example.com', status: 'Online' },
  { id: '111', fullName: 'Kevin Adams', image: '', phoneNumber: '9332211445', email: 'kevin@example.com', status: 'Online' },
  { id: '112', fullName: 'Lisa Wilson', image: '', phoneNumber: '9665544332', email: 'lisa@example.com', status: 'Offline' },
  { id: '113', fullName: 'Mike Taylor', image: '', phoneNumber: '9223344556', email: 'mike@example.com', status: 'Online' },
  { id: '114', fullName: 'Nina Davis', image: '', phoneNumber: '9554433221', email: 'nina@example.com', status: 'Offline' },
  { id: '115', fullName: 'Oliver Martin', image: '', phoneNumber: '9776655443', email: 'oliver@example.com', status: 'Online' },
  { id: '116', fullName: 'Paula Scott', image: '', phoneNumber: '9009988776', email: 'paula@example.com', status: 'Online' },
  { id: '117', fullName: 'Quinn Parker', image: '', phoneNumber: '9110099887', email: 'quinn@example.com', status: 'Offline' },
  { id: '118', fullName: 'Ryan Cooper', image: '', phoneNumber: '9331122334', email: 'ryan@example.com', status: 'Online' },
  { id: '119', fullName: 'Sarah Bennett', image: '', phoneNumber: '9442233445', email: 'sarah@example.com', status: 'Offline' },
  { id: '120', fullName: 'Tom Nelson', image: '', phoneNumber: '9553344556', email: 'tom@example.com', status: 'Online' },
];

export default function AgentList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAgents = dummyAgents.filter(agent =>
    agent.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 transition-all duration-300">
        <h1 className="text-2xl md:text-3xl font-extrabold text-orange-600 mb-4 md:mb-6 tracking-wide">🚴‍♂️ Delivery Agents</h1>

        <input
          type="text"
          placeholder="Search by name..."
          className="mb-4 md:mb-6 w-full p-2 md:p-3 border border-orange-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
          onChange={e => setSearchTerm(e.target.value)}
        />

        {/* Desktop Table (hidden on mobile) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-orange-100 text-orange-700 uppercase">
              <tr>
                <th className="px-2 py-2 sm:px-4 sm:py-3">User ID</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Full Name</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Image</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">Phone</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 hidden md:table-cell">Email</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map(agent => (
                <tr
                  key={agent.id}
                className="border-b border-orange-100 cursor-pointer transition-all duration-200 hover:bg-orange-50 hover:shadow-md group"
                  onClick={() => window.location.href = `/admin/agent-dashboard/agent/details`}
                >
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium">{agent.id}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-800 group-hover:text-orange-600">
                    {agent.fullName}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">
                    <img
                      src={agent.image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                      alt="avatar"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">{agent.phoneNumber}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 hidden md:table-cell truncate max-w-[120px] lg:max-w-none">
                    {agent.email}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${agent.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (only visible on small screens) */}
        <div className="sm:hidden space-y-3">
          {filteredAgents.map(agent => (
            <div
              key={agent.id}
              className="border border-orange-100 rounded-lg p-3 cursor-pointer hover:bg-orange-50 transition-colors duration-200"
              onClick={() => window.location.href = `/agent/details/${agent.id}`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={agent.image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-orange-600">{agent.fullName}</h3>
                  <p className="text-sm text-gray-600">ID: {agent.id}</p>
                </div>
                <span className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold ${agent.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {agent.status}
                </span>
              </div>
              <div className="mt-2 text-sm">
                <p className="truncate">{agent.phoneNumber}</p>
                <p className="truncate text-orange-500">{agent.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}