import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import AddCityModal from "./AddCityModal";
import { createCity, getCities } from "../../../../apis/adminApis/cityApi" 
import { getGeofences } from "../../../../apis/adminApis/geoFenceApi";
const CityList = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
const [geofences, setGeofences] = useState([]);










  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getCities();
        setCities(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch cities");
        setLoading(false);
      }
    };


    const fetchGeofences = async () => {
  try {
    const { data } = await getGeofences();
    setGeofences(data);
  } catch (error) {
    console.error("Failed to fetch geofences", error);
  }
};


  fetchGeofences();
    fetchCities();
  }, []);
  console.log(geofences)
  const handleAddCity = async (newCity) => {
    try {
      console.log(newCity)
      const createdCity = await createCity(newCity);
      setCities([...cities, createdCity]);
      setShowAddCityModal(false);
    } catch (err) {
      setError(err.message || "Failed to create city");
    }
  };

  const toggleStatus = (id) => {
    setCities(cities.map(city => 
      city.id === id ? { ...city, status: !city.status } : city
    ));
    // TODO: Add API call to update status
  };

  if (loading) {
    return <div className="p-6">Loading cities...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      {/* Header and Description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0 md:w-3/4">
          <p className="text-gray-700">
            A city consists of multiple geofences assigned. You can define delivery charges to be applied to custom order placed in this city.
            <br />
            Delivery charges can be of 2 types:
            <br />
            1. Static
            <br />
            2. Dynamic - Defined in the template defined on TOOKAN.
          </p>
        </div>
        <button
          onClick={() => setShowAddCityModal(true)}
          className="bg-[#FC8019] hover:bg-[#e67317] text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" />
          Add City
        </button>
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Charge Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cities.map((city) => (
                <tr key={city.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{city.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{city.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{city.chargeType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={city.status} 
                        onChange={() => toggleStatus(city.id)}
                        className="sr-only peer" 
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FC8019]"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiEdit2 />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiTrash2 />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiMoreVertical />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add City Modal */}
      {showAddCityModal && (
        <AddCityModal
          onClose={() => setShowAddCityModal(false)}
          onSave={handleAddCity}
          geofences={geofences}
        />
      )}
    </div>
  );
};

export default CityList;