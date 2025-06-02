import React from 'react';

const UserProfileHeader = () => {
  return (
    <div className="bg-orange-600 text-white px-6 py-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-1">Ashutosh</h1>
          <p className="text-teal-100 text-lg">8580426354</p>
        </div>
        <button className="border border-orange-300 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded text-l tracking-wide">
          EDIT PROFILE
        </button>
      </div>
    </div>
  );
};

export default UserProfileHeader;