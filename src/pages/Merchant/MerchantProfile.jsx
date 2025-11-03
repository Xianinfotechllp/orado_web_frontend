import React, { useEffect, useState } from "react";
import RestaurantEdit from "../../components/merchant/Dashboard/MerchentProfile/RestuarantEdit";
import MerchentCataloguePage from "../../components/merchant/Dashboard/MerchentProfile/MerchentCataloguePage";
import PolygonMap from "../../components/merchant/Dashboard/ServiceSection/PolygonMap";
import AddServiceModal from "../../components/merchant/Dashboard/ServiceSection/AddServiceModal";
import { getServiceAreas, addServiceArea } from "../../apis/storeApi";
import { MapPin, Plus, Edit3, Info } from "react-feather";

const MerchantProfile = ({ selectedRestaurant }) => {
  const [activeTab, setActiveTab] = useState("catalogue"); // Set default to "catalogue"
  const [restaurantData, setRestaurantData] = useState({
    name: "onion",
    phone: "7023232323",
    email: "onionQ@gmail",
  });
  const [serviceAreas, setServiceAreas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchServiceAreas = async () => {
    if (!selectedRestaurant?.id) return;
    
    setLoading(true);
    try {
      const response = await getServiceAreas(selectedRestaurant.id);
      console.log(response.data, "3434");

      if (response.messageType === "success") {
        setServiceAreas(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching service areas:", error);
      setServiceAreas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRestaurant?.id) {
      fetchServiceAreas();
    }
  }, [selectedRestaurant]);

  const EmptyServiceAreaState = () => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-green-400">
      <div className="text-gray-400 mb-4">
        <MapPin className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        No Service Areas Defined
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        This restaurant doesn't have any delivery service areas yet. 
        Add your first service area to start accepting orders from specific locations.
      </p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2 shadow-md hover:shadow-lg"
      >
        <Plus size={20} />
        Add Service Area
      </button>
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Info size={14} />
        <span>Service areas define where you can deliver orders</span>
      </div>
    </div>
  );

  const ServiceAreasList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Service Areas ({serviceAreas.length})
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Edit3 size={16} />
          Manage Areas
        </button>
      </div>

      {serviceAreas.map((area, index) => (
        <div
          key={area._id || index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-transform hover:shadow-md"
        >
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-medium text-gray-800">
              {area.name || `Service Area ${index + 1}`}
            </h4>
            {area.description && (
              <p className="text-sm text-gray-600 mt-1">{area.description}</p>
            )}
          </div>
          <div className="h-80">
            <PolygonMap
              serviceArea={area}
              restaurantLocation={selectedRestaurant?.location?.coordinates}
              restaurantName={selectedRestaurant?.name}
            />
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                {area.polygon?.coordinates[0]?.length || 0} boundary points
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full p-6">
      {/* Header with restaurant info */}
      {selectedRestaurant && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {selectedRestaurant.name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>📞 {selectedRestaurant.phone}</span>
            <span>📧 {selectedRestaurant.email}</span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {selectedRestaurant.address?.city || "Unknown location"}
            </span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { id: "catalogue", label: "Menu Catalogue" },
            { id: "configurations", label: "Configurations" }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-4 text-sm font-medium capitalize transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-b-2 border-green-500 text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === "catalogue" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">Menu Catalogue</h2>
            </div>

            {selectedRestaurant ? (
              <MerchentCataloguePage restaurantId={selectedRestaurant.id} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <span className="text-4xl">🍽️</span>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Restaurant Selected
                </h3>
                <p className="text-gray-500">
                  Please select a restaurant to manage the menu catalogue
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "configurations" && (
          <div className="p-6">
            {selectedRestaurant ? (
              <div className="space-y-8">
                <RestaurantEdit
                  restaurantId={selectedRestaurant.id}
                  onRestaurantUpdate={() => {
                    console.log("Restaurant updated successfully");
                  }}
                />
                
                {/* Serving Area Section */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="text-green-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Delivery Service Areas
                    </h2>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : serviceAreas.length === 0 ? (
                    <EmptyServiceAreaState />
                  ) : (
                    <ServiceAreasList />
                  )}

                  <AddServiceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    restaurantId={selectedRestaurant.id}
                    onServiceAdded={() => {
                      fetchServiceAreas();
                      setIsModalOpen(false);
                    }}
                    restaurantLocation={selectedRestaurant?.location?.coordinates}
                    restaurantName={selectedRestaurant?.name}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MapPin size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Restaurant Selected
                </h3>
                <p className="text-gray-500">
                  Please select a restaurant to view and edit details
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantProfile;