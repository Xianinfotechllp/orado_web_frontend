import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAddress } from "../../apis/userApi";
import LocationPicker from "../map/LocationPicker";
import EditAddressForm from "../address/EditAddressForm";
import {updateAddress} from "../../apis/userApi"
export default function DeliveryPaymentForm() {
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const location = useSelector((state) => state.location.location);
  const user = useSelector((state) => state.auth.user.user);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await getAddress(user._id); // make sure _id exists

        setAddresses(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (user?._id) {
      fetchAddresses();
    }
  }, []);

  const handleLocationSelect = (location) => {
    console.log("Selected Location:", location);
    
        // Update your form, redux, or API call
  };


  const handleAddressUpdate = (updatedAddress) => {
  // Example: update state or API call here

  // console.log("Updated address details:", updatedAddress);
 const newAddresses = addresses.map((each) => {
  if (each.addressId === updatedAddress.addressId) {
    return updatedAddress;
  }
  return each;
});

  console.log(updatedAddress,"🐔")
  setAddresses(newAddresses)  
  updateAddress(user._id,updatedAddress.addressId,{
    street:  updateAddress.street,
    city:updateAddress.city

  })

  // If you store addresses in state, update it here too
  // setAddresses(prev => prev.map(a => a._id === updatedAddress._id ? updatedAddress : a));
};
  return (
    <div className="w-full space-y-4">
      {/* Delivery Address Section */}

      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-orange-600 font-medium text-base">
            Delivery address
          </h2>
          <button className="text-orange-600 text-sm font-medium hover:underline">
            Change
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-black font-medium text-base">Home</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {location.name}
          </p>
          <p className="text-black font-medium text-sm mt-3">68 mins</p>
        </div>
      </div>
      <div>
        {addresses?.map((each) => {
          return (
            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-orange-600 font-medium text-base">
                  Delivery address
                </h2>
                <button
                  className="text-orange-600 text-sm font-medium hover:underline"
                  onClick={() => setEditingAddress(each)}
                >
                  Change
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-black font-medium text-base">
                  {each.type}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {each.street}, {each.city},{each.state},{each.zip}
                </p>
                <p className="text-black font-medium text-sm mt-3">68 mins</p>
              </div>
            </div>
          );
        })}

        {editingAddress && (
          <EditAddressForm
            address={editingAddress}
            userId={user._id}
            onClose={() => setEditingAddress(null)}
            onUpdate={(form) => {
              setEditingAddress(null);
             
             handleAddressUpdate(form)
            }}

          />
        )}
      </div>

      {/* Payment Method Section */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <h2 className="text-black font-medium text-base mb-4">
          Choose Payment Method
        </h2>

        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded text-base transition-colors">
          Proceed To Pay
        </button>
      </div>

      <div></div>
    </div>
  );
}
