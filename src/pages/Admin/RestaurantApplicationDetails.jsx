import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RestaurantApplicationDetails = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold text-[#EA4424] mb-4">Restaurant Application Details</h2>
      <p><strong>Restaurant Name:</strong> Spice Villa</p>
      <p><strong>Type:</strong> Veg & Non-Veg</p>
      <p><strong>Cuisine:</strong> Indian, Chinese</p>
      <p><strong>Location:</strong> Kochi, Kerala</p>
      <p><strong>Owner:</strong> Ravi Kumar</p>
      <p><strong>Contact:</strong> 9876543210 | ravi@example.com</p>
      <p><strong>Submitted Documents:</strong></p>
      <ul className="list-disc ml-6">
        <li>FSSAI License</li>
        <li>GST Certificate</li>
        <li>ID Proof</li>
        <li>Food Safety Certificate</li>
      </ul>

      <div className="flex gap-4 mt-6">
        <button className="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
        <button onClick={() => navigate(-1)} className="ml-auto text-gray-600 underline">
          Back
        </button>
      </div>
    </div>
  );
};

export default RestaurantApplicationDetails;