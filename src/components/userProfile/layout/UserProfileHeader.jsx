import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../../slices/authSlice';
import { updateUserProfile } from '../../../apis/userApi';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const UserProfileHeader = () => {
  const auth = useSelector((state) => state.auth);
  const user = auth.user;
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isPhoneExpanded, setIsPhoneExpanded] = useState(false);
  const [isEmailExpanded, setIsEmailExpanded] = useState(false);
  const [isNameExpanded, setIsNameExpanded] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    email: user.email || ''
  });

  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVerify = async (field) => {
  try {
    const updatedFields = { [field]: formData[field] };
    const updatedUserResponse = await updateUserProfile(updatedFields);
    const updatedUser = updatedUserResponse.user;
    console.log('upsated', updatedUser);  
    dispatch(setUser({ token: auth.token, user: updatedUser })); 
    console.log(`${field} updated successfully.`);
  } catch (error) {
    console.error(`Failed to update ${field}:`, error);
  }

  if (field === 'phone') setIsPhoneExpanded(false);
  if (field === 'email') setIsEmailExpanded(false);
  if (field === 'name') setIsNameExpanded(false);
};

  return (
    <>
      <div className="bg-orange-600 text-white px-6 py-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
            {user.phone && <p className="text-teal-100 text-lg">{user.phone}</p>}
            <p className="text-teal-100 text-lg">{user.email}</p>
          </div>
          <button 
            onClick={() => setIsEditPanelOpen(true)}
            className="border border-orange-300 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded text-l tracking-wide"
          >
            EDIT PROFILE
          </button>
        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isEditPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bgOp z-40"
            onClick={() => setIsEditPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Side Panel */}
      <AnimatePresence>
        {isEditPanelOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Edit profile</h2>
              <button
                onClick={() => setIsEditPanelOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Name Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Name</h3>
                  <button
                    onClick={() => setIsNameExpanded(!isNameExpanded)}
                    className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors"
                  >
                    CHANGE
                  </button>
                </div>
                
                {!isNameExpanded ? (
                  <div className="text-gray-600">{formData.name}</div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="New name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => handleVerify('name')}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      UPDATE
                    </button>
                  </div>
                )}
              </div>

              {/* Phone Number Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Phone number</h3>
                  <button
                    onClick={() => setIsPhoneExpanded(!isPhoneExpanded)}
                    className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors"
                  >
                    CHANGE
                  </button>
                </div>
                
                {!isPhoneExpanded ? (
                  <div className="text-gray-600">{formData.phone}</div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="New phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => handleVerify('phone')}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      VERIFY
                    </button>
                  </div>
                )}
              </div>

              {/* Email Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Email id</h3>
                  <button
                    onClick={() => setIsEmailExpanded(!isEmailExpanded)}
                    className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors"
                  >
                    CHANGE
                  </button>
                </div>
                
                {!isEmailExpanded ? (
                  <div className="text-gray-600">{formData.email}</div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="New email address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => handleVerify('email')}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      VERIFY
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserProfileHeader;