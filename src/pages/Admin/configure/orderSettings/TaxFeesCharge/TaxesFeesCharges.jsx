import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Receipt,
  Building2,
  Package,
  Store,
  CreditCard,
  Plus,
} from "lucide-react";
import DataTable from "../../../../../components/admin/configure/orderSettings/TaxFeesCharge/DataTable";
import SectionHeader from "../../../../../components/admin/configure/orderSettings/TaxFeesCharge/SectionHeader";
import Toggle from "../../../../../components/admin/configure/orderSettings/TaxFeesCharge/Toggle";
import MarketplaceTaxModal from "../../../../../components/admin/configure/orderSettings/TaxFeesCharge/MarketplaceTaxModal";
import {
  createTaxOrCharge,
  getAllTaxesAndCharges,
  toggleTaxOrChargeStatus,
} from "../../../../../apis/adminApis/TaxOrCharge";
import MerchantTaxModal from "../../../../../components/admin/configure/orderSettings/TaxFeesCharge/MerchantTaxModal";
import { fetchRestaurantsDropdown } from "../../../../../apis/adminApis/adminFuntionsApi";
import MarketplacePackingModal from "../../../../../components/admin/configure/orderSettings/MarketplacePackingModal";
import { toast } from "react-toastify";
import MerchantPackingChargeModal from "../../../../../components/admin/configure/orderSettings/TaxFeesCharge/MerchantPackingChargeModal";
import MarketplaceAdditionalChargeModal from "../../../../../components/admin/configure/orderSettings/TaxFeesCharge/MarketplaceAdditionalChargeModal";
import MerchantAdditionalChargeModal from "../../../../../components/admin/configure/orderSettings/TaxFeesCharge/MerchantAdditionalChargeModal";

function TaxesFeesCharges() {
  // State for modals
  const [isMarketTaxModalOpen, setIsMarketTaxModalOpen] = useState(false);
  const [isMerchantTaxModal, setIsMerchantTaxModal] = useState(false);
  const [isMarketpackModalOpen, setIsMarketpackModalOpen] = useState(false);
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);
  const [isMarketAdditionModalOpen, setIsMarketAdditionModalOpen] = useState(false);
  const [isMerchantAdditionalModalOpen, setIsMerchantAdditionalModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Merchant selection state
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [selectedPackingMerchant, setSelectedPackingMerchant] = useState("all");
  const [selectedAdditionalMerchant, setSelectedAdditionalMerchant] = useState("all");

  // Data states
  const [marketplaceTaxes, setMarketplaceTaxes] = useState([]);
  const [merchantTaxes, setMerchantTaxes] = useState([]);
  const [merchants, setMerchants] = useState([{ _id: "all", name: "All Merchants" }]);
  const [marketplacePackingCharges, setMarketplacePackingCharges] = useState([]);
  const [merchantPackingCharges, setMerchantPackingCharges] = useState([]);
  const [marketplaceAdditionalCharges, setMarketplaceAdditionalCharges] = useState([]);
  const [merchantAdditionalCharges, setMerchantAdditionalCharges] = useState([]);

  // Toggle states
  const [merchantTaxesEnabled, setMerchantTaxesEnabled] = useState(true);
  const [merchantPackingEnabled, setMerchantPackingEnabled] = useState(true);
  const [merchantAdditionalEnabled, setMerchantAdditionalEnabled] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch merchants
        const merchantsResponse = await fetchRestaurantsDropdown();
        setMerchants([{ _id: "all", name: "All Merchants" }, ...merchantsResponse.data]);

        // Fetch all taxes and charges
        const allCharges = await getAllTaxesAndCharges();
        
        // Filter and set data with null checks
        setMarketplaceTaxes(allCharges.filter(
          charge => charge?.level === "Marketplace" && charge?.category === "Tax"
        ));
        
        setMerchantTaxes(allCharges.filter(
          charge => charge?.level === "Merchant" && charge?.category === "Tax"
        ));
        
        setMarketplacePackingCharges(allCharges.filter(
          charge => charge?.level === "Marketplace" && charge?.category === "PackingCharge"
        ));
        
        setMerchantPackingCharges(allCharges.filter(
          charge => charge?.level === "Merchant" && charge?.category === "PackingCharge"
        ));
        
        setMarketplaceAdditionalCharges(allCharges.filter(
          charge => charge?.level === "Marketplace" && charge?.category === "AdditionalCharge"
        ));
        
        setMerchantAdditionalCharges(allCharges.filter(
          charge => charge?.level === "Merchant" && charge?.category === "AdditionalCharge"
        ));
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter merchant taxes based on selected merchant with null checks
  const filteredMerchantTaxes = selectedMerchant === "all"
    ? merchantTaxes
    : merchantTaxes.filter(tax => tax?.merchant?._id === selectedMerchant);

  // Filter merchant packing charges based on selected merchant with null checks
  const filteredMerchantPackingCharges = selectedPackingMerchant === "all"
    ? merchantPackingCharges
    : merchantPackingCharges.filter(charge => charge?.merchant?._id === selectedPackingMerchant);

  // Filter merchant additional charges based on selected merchant with null checks
  const filteredMerchantAdditionalCharges = selectedAdditionalMerchant === "all"
    ? merchantAdditionalCharges
    : merchantAdditionalCharges.filter(charge => charge?.merchant?._id === selectedAdditionalMerchant);

  // Handler functions
  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  const handleDelete = (item, setState, data) => {
    setState(data.filter(d => d.id !== item.id));
  };

const handleStatusToggle = async (item, setState, data) => {
  try {
    // Optimistically update the UI
    setState(prevData => 
      prevData.map(d => 
        d._id === item._id ? { ...d, status: !d.status } : d
      )
    );

    // Call the API to toggle the status
    const updatedItem = await toggleTaxOrChargeStatus(item._id);
    
    // Update state with the actual response from server
    setState(prevData => 
      prevData.map(d => 
        d._id === updatedItem._id ? updatedItem : d
      )
    );

    toast.success("Status updated successfully");
  } catch (error) {
    // Revert the UI if the API call fails
    setState(data);
    toast.error(error.message || "Failed to update status");
    console.error("Error toggling status:", error);
  }
};

  const handleAddMerchantPackingCharge = async (payload) => {
    try {
      const finalPayload = {
        ...payload,
        merchant: selectedPackingMerchant === "all" ? null : selectedPackingMerchant,
        level: "Merchant",
        category: "PackingCharge"
      };
      
      const response = await createTaxOrCharge(finalPayload);
  
      // setMerchantPackingCharges([...merchantPackingCharges, response.data]);
      setMerchantPackingCharges(prev => [...prev, response.data]);
      toast.success("Packing charge added successfully");
      setIsPackingModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create packing charge");
      console.error("Error creating packing charge:", error);
    }
  };

  const handleCreateMarketplacePackingCharge = async (payload) => {
    try {
      const finalPayload = {
        ...payload,
        category: "PackingCharge",
        level: "Marketplace"
      };

      const response = await createTaxOrCharge(finalPayload);
      setMarketplacePackingCharges([...marketplacePackingCharges, response]);
      toast.success("Marketplace packing charge created successfully");
      setIsMarketpackModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create packing charge");
      console.error("Error creating marketplace packing charge:", error);
    }
  };

  const handleCreateMarketplaceAdditionalCharge = async (payload) => {
    try {
      const finalPayload = {
        ...payload,
        category: "AdditionalCharge",
        level: "Marketplace"
      };
      
      const response = await createTaxOrCharge(finalPayload);
      setMarketplaceAdditionalCharges([...marketplaceAdditionalCharges, response]);
      toast.success("Marketplace additional charge created successfully");
      setIsMarketAdditionModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create additional charge");
      console.error("Error creating marketplace additional charge:", error);
    }
  };

  const handleCreateMerchantAdditionalCharge = async (payload) => {
    try {
      const finalPayload = {
        ...payload,
        merchant: selectedAdditionalMerchant === "all" ? null : selectedAdditionalMerchant,
        level: "Merchant",
        category: "AdditionalCharge"
      };
      
      const response = await createTaxOrCharge(finalPayload);
      setMerchantAdditionalCharges([...merchantAdditionalCharges, response]);
      toast.success("Merchant additional charge created successfully");
      setIsMerchantAdditionalModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create additional charge");
      console.error("Error creating merchant additional charge:", error);
    }
  };

  const handleCreateTax = async (payload) => {
    setIsLoading(true);
    try {
      console.log(payload)
       const createdTax = await createTaxOrCharge(payload);
      
      if (payload.level === "Marketplace") {
        setMarketplaceTaxes([...marketplaceTaxes, createdTax]);
      } else {
        setMerchantTaxes([...merchantTaxes, createdTax]);
      }
      
      setIsMarketTaxModalOpen(false);
      setIsMerchantTaxModal(false);
      toast.success("Tax created successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create tax");
      console.error("Failed to create tax:", err);
    } finally {
      setIsLoading(false);
    }
  };


 const handleCreateMerchantTax = async (payload) => {
  setIsLoading(true);
  try {
    const finalPayload = {
      ...payload,
      level: "Merchant",
      merchant: selectedMerchant === "all" ? null : selectedMerchant,
      category: "Tax"
    };
    
    const createdTax = await createTaxOrCharge(finalPayload);
    setMerchantTaxes([...merchantTaxes, createdTax]);
    
    setIsMerchantTaxModal(false);
    toast.success("Merchant tax created successfully");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to create merchant tax");
    console.error("Failed to create merchant tax:", err);
  } finally {
    setIsLoading(false);
  }
};

  // Column definitions
  const taxColumns = [
    { key: "name", label: "Tax Name", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "value", label: "Value", sortable: true },
    { key: "applicableOn", label: "Applicable On", sortable: true },
   { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value) => value ? 'Active' : 'Inactive' // Convert boolean to readable string
  }
  ];

  const merchantTaxColumns = [
    { key: "_id", label: "Tax ID", sortable: true },
    { key: "name", label: "Tax Name", sortable: true },
    { key: "value", label: "Tax Value", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "applicableOn", label: "Applicable On", sortable: true },
    { key: "merchant.name", label: "Merchant Name", sortable: true },
    { key: "status", label: "Status", sortable: false },
  ];

  const chargeColumns = [
    { key: "name", label: "Name", sortable: true },
    { key: "value", label: "Amount", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "applicableOn", label: "Applicable On", sortable: true },
    { key: "status", label: "Status", sortable: false },
  ];

  const merchantChargeColumns = [
    { key: "name", label: "Name", sortable: true },
    { key: "value", label: "Amount", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "applicableOn", label: "Applicable On", sortable: true },
    { key: "merchant.name", label: "Merchant Name", sortable: true },
    { key: "status", label: "Status", sortable: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Taxes & Charges</h1>
              <p className="text-gray-600 mt-1">
                Manage all taxes and additional charges
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* 1. Marketplace Level Taxes */}
        <section>
          <SectionHeader
            title="Marketplace Level Taxes"
            description="Manage taxes applied at the marketplace level across all merchants"
            buttonText="Add New Marketplace Tax"
            onAddNew={() => setIsMarketTaxModalOpen(true)}
            icon={Receipt}
          />
          <DataTable
            data={marketplaceTaxes}
            columns={taxColumns}
            onEdit={handleEdit}
            onDelete={(item) =>
              handleDelete(item, setMarketplaceTaxes, marketplaceTaxes)
            }
            onStatusToggle={(item) =>
              handleStatusToggle(item, setMarketplaceTaxes, marketplaceTaxes)
            }
          />
        </section>

        {/* 2. Merchant Level Taxes */}
        <section>
          <SectionHeader
            title="Merchant Level Taxes"
            description="Manage taxes specific to individual merchants"
            buttonText="Add New Merchant Tax"
            onAddNew={() => setIsMerchantTaxModal(true)}
            icon={Building2}
          />
          <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
            <Toggle
              enabled={merchantTaxesEnabled}
              onChange={() => setMerchantTaxesEnabled(!merchantTaxesEnabled)}
              label="Enable merchant-specific taxes"
              size="md"
            />
            <p className="text-sm text-gray-500 mt-2">
              Allow merchants to set their own tax rates and rules
            </p>
          </div>
          {merchantTaxesEnabled && (
            <>
              <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Merchant
                    </label>
                    <select
                      value={selectedMerchant}
                      onChange={(e) => setSelectedMerchant(e.target.value)}
                      className="block w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {merchants.map((merchant) => (
                        <option key={merchant._id} value={merchant._id}>
                          {merchant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedMerchant === "all"
                      ? `Showing ${filteredMerchantTaxes.length} taxes from all merchants`
                      : `Showing ${filteredMerchantTaxes.length} taxes for ${
                          merchants.find(m => m._id === selectedMerchant)?.name || 'selected merchant'
                        }`}
                  </div>
                </div>
              </div>

              <DataTable
                data={filteredMerchantTaxes}
                columns={merchantTaxColumns}
                onEdit={handleEdit}
                onDelete={(item) =>
                  handleDelete(item, setMerchantTaxes, merchantTaxes)
                }
                onStatusToggle={(item) =>
                  handleStatusToggle(item, setMerchantTaxes, merchantTaxes)
                }
              />
            </>
          )}
        </section>

        {/* 3. Marketplace Level Packing Charges */}
        <section>
          <SectionHeader
            title="Marketplace Level Packing Charges"
            description="Manage packing charges applied at the marketplace level"
            buttonText="Add New Marketplace Packing Charge"
            onAddNew={() => setIsMarketpackModalOpen(true)}
            icon={Package}
          />
          <DataTable
            data={marketplacePackingCharges}
            columns={chargeColumns}
            onEdit={handleEdit}
            onDelete={(item) =>
              handleDelete(item, setMarketplacePackingCharges, marketplacePackingCharges)
            }
            onStatusToggle={(item) =>
              handleStatusToggle(item, setMarketplacePackingCharges, marketplacePackingCharges)
            }
          />
        </section>

        {/* 4. Merchant Level Packing Charges */}
        <section>
          <SectionHeader
            title="Merchant Level Packing Charges"
            description="Manage packing charges specific to individual merchants"
            buttonText="Add New Merchant Packing Charge"
            onAddNew={() => setIsPackingModalOpen(true)}
            icon={Store}
          />
          <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
            <Toggle
              enabled={merchantPackingEnabled}
              onChange={() => setMerchantPackingEnabled(!merchantPackingEnabled)}
              label="Allow merchant packing charges"
              size="md"
            />
            <p className="text-sm text-gray-500 mt-2">
              Allow merchants to set their own packing charges and packaging options
            </p>
          </div>
          {merchantPackingEnabled && (
            <>
              <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Merchant
                    </label>
                    <select
                      value={selectedPackingMerchant}
                      onChange={(e) => setSelectedPackingMerchant(e.target.value)}
                      className="block w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {merchants.map((merchant) => (
                        <option key={merchant._id} value={merchant._id}>
                          {merchant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedPackingMerchant === "all"
                      ? `Showing ${filteredMerchantPackingCharges.length} packing charges from all merchants`
                      : `Showing ${filteredMerchantPackingCharges.length} packing charges for ${
                          merchants.find(m => m._id === selectedPackingMerchant)?.name || 'selected merchant'
                        }`}
                  </div>
                </div>
              </div>

              <DataTable
                data={filteredMerchantPackingCharges}
                columns={merchantChargeColumns}
                onEdit={handleEdit}
                onDelete={(item) =>
                  handleDelete(item, setMerchantPackingCharges, merchantPackingCharges)
                }
                onStatusToggle={(item) =>
                  handleStatusToggle(item, setMerchantPackingCharges, merchantPackingCharges)
                }
              />
            </>
          )}
        </section>

        {/* 5. Marketplace Level Additional Charges */}
        <section>
          <SectionHeader
            title="Marketplace Level Additional Charges"
            description="Manage additional charges applied at the marketplace level"
            buttonText="Add New Marketplace Additional Charge"
            onAddNew={() => setIsMarketAdditionModalOpen(true)}
            icon={CreditCard}
          />
          <DataTable
            data={marketplaceAdditionalCharges}
            columns={chargeColumns}
            onEdit={handleEdit}
            onDelete={(item) =>
              handleDelete(item, setMarketplaceAdditionalCharges, marketplaceAdditionalCharges)
            }
            onStatusToggle={(item) =>
              handleStatusToggle(item, setMarketplaceAdditionalCharges, marketplaceAdditionalCharges)
            }
          />
        </section>

        {/* 6. Merchant Level Additional Charges */}
        <section>
          <SectionHeader
            title="Merchant Level Additional Charges"
            description="Manage additional charges specific to individual merchants"
            buttonText="Add New Merchant Additional Charge"
            onAddNew={() => setIsMerchantAdditionalModalOpen(true)}
            icon={Plus}
          />
          <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
            <Toggle
              enabled={merchantAdditionalEnabled}
              onChange={() => setMerchantAdditionalEnabled(!merchantAdditionalEnabled)}
              label="Allow merchant-specific additional charges"
              size="md"
            />
            <p className="text-sm text-gray-500 mt-2">
              Allow merchants to set their own additional charges and special fees
            </p>
          </div>
          {merchantAdditionalEnabled && (
            <>
              <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Merchant
                    </label>
                    <select
                      value={selectedAdditionalMerchant}
                      onChange={(e) => setSelectedAdditionalMerchant(e.target.value)}
                      className="block w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {merchants.map((merchant) => (
                        <option key={merchant._id} value={merchant._id}>
                          {merchant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedAdditionalMerchant === "all"
                      ? `Showing ${filteredMerchantAdditionalCharges.length} additional charges from all merchants`
                      : `Showing ${filteredMerchantAdditionalCharges.length} additional charges for ${
                          merchants.find(m => m._id === selectedAdditionalMerchant)?.name || 'selected merchant'
                        }`}
                  </div>
                </div>
              </div>

              <DataTable
                data={filteredMerchantAdditionalCharges}
                columns={merchantChargeColumns}
                onEdit={handleEdit}
                onDelete={(item) =>
                  console.log(item)
                  // handleDelete(item, setMerchantAdditionalCharges, merchantAdditionalCharges)
                }
                onStatusToggle={(item) =>
                 
                  handleStatusToggle(item, setMerchantAdditionalCharges, merchantAdditionalCharges)
                }
              />
            </>
          )}
        </section>

        {/* Modals */}
        <MarketplaceTaxModal
          isOpen={isMarketTaxModalOpen}
          onClose={() => setIsMarketTaxModalOpen(false)}
          onSubmit={handleCreateTax}
        />

       <MerchantTaxModal
  isOpen={isMerchantTaxModal}
  onClose={() => setIsMerchantTaxModal(false)}
  onSubmit={handleCreateMerchantTax}
  merchants={merchants.filter(m => m._id !== "all")}
  selectedMerchant={selectedMerchant === "all" ? null : selectedMerchant}
/>

        <MarketplacePackingModal
          isOpen={isMarketpackModalOpen}
          onClose={() => setIsMarketpackModalOpen(false)}
          onSubmit={handleCreateMarketplacePackingCharge}
        />

        <MerchantPackingChargeModal
          isOpen={isPackingModalOpen}
          onClose={() => setIsPackingModalOpen(false)}
          onSubmit={handleAddMerchantPackingCharge}
          merchant={selectedPackingMerchant === "all" ? { _id: "all", name: "All Merchants" } : merchants.find(m => m._id === selectedPackingMerchant)}
        />

        <MarketplaceAdditionalChargeModal
          isOpen={isMarketAdditionModalOpen}
          onClose={() => setIsMarketAdditionModalOpen(false)}
          onSubmit={handleCreateMarketplaceAdditionalCharge}
        />

        <MerchantAdditionalChargeModal
          isOpen={isMerchantAdditionalModalOpen}
          onClose={() => setIsMerchantAdditionalModalOpen(false)}
          onSubmit={handleCreateMerchantAdditionalCharge}
          merchants={merchants.filter(m => m._id !== "all")}
          selectedMerchant={selectedAdditionalMerchant === "all" ? null : selectedAdditionalMerchant}
        />
      </div>
    </div>
  );
}

export default TaxesFeesCharges;