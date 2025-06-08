import React, { useState, useEffect } from 'react';
import { Home, Briefcase, MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { getAddress, deleteAddress, updateAddress, addAddress } from '../../../apis/userApi';
import NewAddressForm from '../../address/NewAddressForm';
import EditAddressForm from '../../address/EditAddressForm';

const ManageAddresses = ({ userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchAddresses = async () => {
      try {
        setLoading(true);
        const res = await getAddress();
        setAddresses(res.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch addresses');
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (addressId) => {
    try {
      setIsDeleting(addressId);
      await deleteAddress(addressId);
      setAddresses(prev => prev.filter(address => address.addressId !== addressId));
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddNewAddress = async (newAddress) => {
    try {
      const res = await addAddress(newAddress);
      setAddresses(prev => [...prev, res.data]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add address:", error);
      alert("Failed to add new address. Please try again.");
    }
  };

  const handleUpdateAddress = async (updatedAddress) => {
      try {
          const res = await updateAddress(
              updatedAddress.addressId,
              updatedAddress
          );

          if (res && res.address) { 
            const updatedAddressData = res.address; 
            setAddresses(prev =>
                prev.map(address =>
                    address._id === updatedAddressData._id ? updatedAddressData : address
                )
            );
            setEditingAddress(null);
            fetchAddresses(); // Refresh addresses after update
        } else {
            console.error('Unexpected response format', res); 
        }
      } catch (error) {
          console.error("Failed to update address:", error);
          alert("Failed to update address. Please try again.");
      }
  };


  const getIconComponent = (type) => {
    switch (type) {
      case 'Home':
        return Home;
      case 'Work':
        return Briefcase;
      default:
        return MapPin;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <p>Loading addresses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12 text-red-500">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Manage Addresses
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Add, edit or delete your delivery addresses
        </p>
      </div>

      {/* Add New Address Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.map((address) => {
          const IconComponent = getIconComponent(address.type);
          const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}, India`;
          
          return (
            <div
              key={address.addressId}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                {/* Address Info */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {address.type}
                      </h3>
                      {address.displayName && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          ({address.displayName})
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {fullAddress}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4 sm:mt-0 sm:ml-4">
                  <button
                    onClick={() => setEditingAddress(address)}
                    className="flex items-center space-x-1 px-3 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg font-medium transition-colors duration-200 text-sm"
                    disabled={isDeleting === address.addressId}
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="hidden sm:inline">EDIT</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(address.addressId)}
                    className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200 text-sm"
                    disabled={isDeleting === address.addressId}
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting === address.addressId ? (
                      <span>DELETING...</span>
                    ) : (
                      <>
                        <span className="hidden sm:inline">DELETE</span>
                        <span className="sm:hidden">Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
          <p className="text-gray-500 mb-6">Add your first delivery address to get started</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Address</span>
          </button>
        </div>
      )}

      {/* Add New Address Modal */}
      {showAddForm && (
        <NewAddressForm
          userId={userId}
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddNewAddress}
        />
      )}

      {/* Edit Address Modal */}
      {editingAddress && (
        <EditAddressForm
          address={editingAddress}
          onClose={() => setEditingAddress(null)}
          onUpdate={handleUpdateAddress}
        />
      )}
    </div>
  );
};

export default ManageAddresses;