import { useState } from 'react';

const CancellationSettings = () => {
  const [settings, setSettings] = useState({
    cancellationEnabled: true,
    reasonType: 'predefined', // 'custom' or 'predefined'
    allowOverride: false
  });

  const [cancellationPolicies, setCancellationPolicies] = useState([]);

  const handleToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleReasonTypeChange = (type) => {
    setSettings(prev => ({
      ...prev,
      reasonType: type
    }));
  };

  const addNewPolicy = () => {
    // In a real app, this would open a modal/form to create a new policy
    const newPolicy = {
      id: Date.now(),
      name: `Policy ${cancellationPolicies.length + 1}`,
      stages: {
        pending: { amount: 0, type: 'percentage' },
        ongoing: { amount: 0, type: 'percentage' },
        dispatched: { amount: 0, type: 'percentage' }
      }
    };
    setCancellationPolicies([...cancellationPolicies, newPolicy]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28.5833 32.6921C28.3927 32.8665 28.1005 32.8669 27.9093 32.693L25.3289 30.3449C25.1108 30.1464 25.1109 29.8033 25.3292 29.605L25.3926 29.5473C25.5834 29.374 25.8746 29.3741 26.0653 29.5475L27.881 31.1989C28.0717 31.3724 28.3632 31.3724 28.5539 31.1988L32.8515 27.2882C33.0449 27.1122 33.3412 27.115 33.5313 27.2945L33.6089 27.3677C33.8201 27.5672 33.8174 27.9041 33.6031 28.1002L28.5833 32.6921ZM18.318 27.0993C18.1273 27.2729 17.8357 27.273 17.6449 27.0994L17.5811 27.0413C17.3631 26.8429 17.3631 26.5 17.5811 26.3017L18.6419 25.3364C18.8599 25.138 18.8599 24.7951 18.6419 24.5967L17.5814 23.6317C17.3633 23.4332 17.3634 23.0901 17.5816 22.8918L17.645 22.8342C17.8358 22.6609 18.1271 22.661 18.3178 22.8345L19.5186 23.9272C19.7094 24.1008 20.0009 24.1008 20.1917 23.9272L21.3925 22.8345C21.5832 22.661 21.8745 22.6609 22.0653 22.8342L22.1287 22.8918C22.3469 23.0901 22.347 23.4332 22.1289 23.6317L21.0684 24.5967C20.8504 24.7951 20.8504 25.138 21.0684 25.3364L22.1289 26.3014C22.347 26.4999 22.3469 26.843 22.1287 27.0413L22.0653 27.0989C21.8745 27.2722 21.5832 27.2721 21.3925 27.0986L20.1918 26.006C20.001 25.8323 19.7094 25.8324 19.5186 26.0061L18.318 27.0993ZM15.8924 32.4256C15.3529 32.4256 14.9029 32.2615 14.5422 31.9333C14.1815 31.6051 14.0008 31.1956 14 30.7047V17.0972C14 16.607 14.1807 16.1978 14.5422 15.8696C14.9036 15.5414 15.3537 15.377 15.8924 15.3763H17.4639C17.7401 15.3763 17.9639 15.1524 17.9639 14.8763V13.5C17.9639 13.2239 18.1878 13 18.4639 13H18.7251C19.0013 13 19.2251 13.2239 19.2251 13.5V14.8763C19.2251 15.1524 19.449 15.3763 19.7251 15.3763H27.1027C27.3788 15.3763 27.6027 15.1524 27.6027 14.8763V13.5C27.6027 13.2239 27.8265 13 28.1027 13H28.2737C28.5498 13 28.7737 13.2239 28.7737 13.5V14.8763C28.7737 15.1524 28.9976 15.3763 29.2737 15.3763H30.8452C31.3839 15.3763 31.834 15.5407 32.1954 15.8696C32.5569 16.1985 32.7372 16.6081 32.7365 17.0982V22.9707C32.7365 23.1094 32.6789 23.2418 32.5775 23.3363L32.4065 23.4959C32.0868 23.794 31.5654 23.5673 31.5654 23.1302V21.8606C31.5654 21.5845 31.3416 21.3606 31.0654 21.3606H15.671C15.3949 21.3606 15.171 21.5845 15.171 21.8606V30.7047C15.171 30.8681 15.246 31.0184 15.3959 31.1555C15.5458 31.2926 15.7109 31.3608 15.8912 31.3601H21.6477C21.7694 31.3601 21.8869 31.4044 21.9782 31.4849L22.0527 31.5505C22.3985 31.8551 22.183 32.4256 21.7222 32.4256H15.8924Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Cancellation Settings</h2>
            <p className="text-sm text-gray-500">Configure order cancellation rules and policies</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={settings.cancellationEnabled}
            onChange={() => handleToggle('cancellationEnabled')}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Cancellation Reasons Section */}
      <section className="py-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <h3 className="text-lg font-medium text-gray-800">Cancellation Reasons</h3>
            <p className="text-sm text-gray-500 mt-1">
              Configure how customers specify cancellation reasons
            </p>
          </div>
          <div className="md:w-2/3">
            <div className="bg-gray-50/50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">
                Choose between custom reasons (customers enter their own) or predefined reasons (select from your list)
              </p>

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="customReason"
                    name="reasonType"
                    checked={settings.reasonType === 'custom'}
                    onChange={() => handleReasonTypeChange('custom')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="customReason" className="text-sm font-medium text-gray-700">
                    Custom Reasons
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="predefinedReason"
                    name="reasonType"
                    checked={settings.reasonType === 'predefined'}
                    onChange={() => handleReasonTypeChange('predefined')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="predefinedReason" className="text-sm font-medium text-gray-700">
                    Predefined Reasons
                  </label>
                </div>
              </div>

              {settings.reasonType === 'predefined' && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Add predefined reasons for customers to select:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add new reason"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                        Add
                      </button>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <p className="text-xs text-gray-500 mb-2">Current reasons:</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <span className="text-sm">Changed my mind</span>
                          <button className="text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <span className="text-sm">Order placed by mistake</span>
                          <button className="text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cancellation Policies Section */}
      <section className="py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <h3 className="text-lg font-medium text-gray-800">Cancellation Policies</h3>
            <p className="text-sm text-gray-500 mt-1">
              Define cancellation fees at different order stages
            </p>
          </div>
          <div className="md:w-2/3">
            <div className="bg-gray-50/50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm text-gray-600 flex-1">
                  Set cancellation policies that define refund amounts at different order stages (pending, ongoing, dispatched).
                </p>
                <button 
                  onClick={addNewPolicy}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
                >
                  Add New Policy
                </button>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 mb-4">
                <p className="text-sm text-gray-600">
                  Allow restaurants to override these policies with their own rules
                </p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.allowOverride}
                    onChange={() => handleToggle('allowOverride')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {cancellationPolicies.length > 0 ? (
                <div className="space-y-4">
                  {cancellationPolicies.map(policy => (
                    <div key={policy.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-800">{policy.name}</h4>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pending Stage</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={policy.stages.pending.amount}
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                            />
                            <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                              <option>%</option>
                              <option>$</option>
                            </select>
                          </div>
                        </div>
                        <div className="border rounded-lg p-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ongoing Stage</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={policy.stages.ongoing.amount}
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                            />
                            <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                              <option>%</option>
                              <option>$</option>
                            </select>
                          </div>
                        </div>
                        <div className="border rounded-lg p-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dispatched Stage</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={policy.stages.dispatched.amount}
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                            />
                            <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                              <option>%</option>
                              <option>$</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="mt-3 text-lg font-medium text-gray-700">No Cancellation Policies</h4>
                  <p className="mt-1 text-sm text-gray-500">Add your first cancellation policy to get started</p>
                  <button 
                    onClick={addNewPolicy}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
                  >
                    Create Policy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CancellationSettings;