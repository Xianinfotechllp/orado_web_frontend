import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiCheck, FiX } from 'react-icons/fi';

const RestaurantApprovalsPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('latest');

    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const token = sessionStorage.getItem('adminToken'); // adjust if stored elsewhere
                const response = await axios.get('http://localhost:5000/admin/restaurant-requests', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response)

                const formatted = response.data.restaurants.map((user) => ({
                    id: user._id,
                    name: user.merchantApplication?.restaurantName || 'N/A',
                    owner: user.name,
                    location: user.merchantApplication?.location || 'N/A',
                    contact: user.phone,
                    submittedAt: new Date(user.createdAt).toISOString().split('T')[0],
                    status: user.merchantApplication?.status || 'Pending',
                }));

                setRestaurants(formatted);
            } catch (err) {
                console.error('Failed to fetch merchants:', err);
            }
        };

        fetchMerchants();
    }, []);

   const handleApprove = async (id) => {
  try {
    const token = sessionStorage.getItem('adminToken');
    await axios.post(
      `http://localhost:5000/admin/restaurant-application/${id}/update`,
      { action: "approved" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    alert("Restaurant approved successfully.");
  } catch (err) {
    console.error("Failed to approve:", err);
    alert("Failed to approve restaurant.");
  }
};

const handleReject = async (id) => {
  try {
    const token = sessionStorage.getItem('adminToken');
    await axios.post(
      `http://localhost:5000/admin/restaurant-application/${id}/update`,
      {
        action: "rejected",
        reason: "Documents incomplete", // You can make this dynamic with a prompt/input
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    alert("Restaurant rejected.");
  } catch (err) {
    console.error("Failed to reject:", err);
    alert("Failed to reject restaurant.");
  }
};


    const filtered = restaurants
        .filter((r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.owner.toLowerCase().includes(search.toLowerCase())
        )
        .filter((r) => (locationFilter ? r.location.includes(locationFilter) : true))
        .filter((r) => (statusFilter ? r.status === statusFilter : true))
        .sort((a, b) => {
            if (sortBy === 'latest') return new Date(b.submittedAt) - new Date(a.submittedAt);
            if (sortBy === 'az') return a.name.localeCompare(b.name);
            return 0;
        });

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#EA4424] mb-6">Restaurant Approvals</h2>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name or owner"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">All Locations</option>
                    {[...new Set(restaurants.map(r => r.location))].map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="latest">Latest</option>
                    <option value="az">A - Z</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded">
                    <thead className="bg-[#EA4424] text-white">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Owner</th>
                            <th className="p-3 text-left">Location</th>
                            <th className="p-3 text-left">Contact</th>
                            <th className="p-3 text-left">Submitted</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">No matching records</td>
                            </tr>
                        ) : (
                            filtered.map((r) => (
                                <tr key={r.id} className="border-t hover:bg-gray-100">
                                    <td className="p-3">{r.name}</td>
                                    <td className="p-3">{r.owner}</td>
                                    <td className="p-3">{r.location}</td>
                                    <td className="p-3">{r.contact}</td>
                                    <td className="p-3">{r.submittedAt}</td>
                                    <td className="p-3 flex gap-2">
                                        <Link
                                            to={`/admin/dashboard/restaurant-approvals/${r.id}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            <FiEye />
                                        </Link>
                                        <button onClick={() => handleApprove(r.id)} className="text-green-600">
                                            <FiCheck />
                                        </button>
                                        <button onClick={() => handleReject(r.id)} className="text-red-600">
                                            <FiX />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RestaurantApprovalsPage;
