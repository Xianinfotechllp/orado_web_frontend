import React, { useState } from 'react';
import { 
  DollarSign, 
  Receipt, 
  Building2,
  Package,
  Store,
  CreditCard,
  Plus
} from 'lucide-react';
import DataTable from '../../../../../components/admin/configure/orderSettings/TaxFeesCharge/DataTable';
import SectionHeader from '../../../../../components/admin/configure/orderSettings/TaxFeesCharge/SectionHeader';
import Toggle from '../../../../../components/admin/configure/orderSettings/TaxFeesCharge/Toggle';

function TaxesFeesCharges() {
  // Marketplace Taxes State
  // Marketplace Taxes State
  const [marketplaceTaxes, setMarketplaceTaxes] = useState([
    {
      id: 'TX001',
      name: 'GST',
      value: '18%',
      type: 'Percentage',
      applicableOn: 'Food Items',
      status: 'Active'
    },
    {
      id: 'TX002',
      name: 'Service Tax',
      value: '12%',
      type: 'Percentage',
      applicableOn: 'All Orders',
      status: 'Active'
    },
    {
      id: 'TX003',
      name: 'Platform Fee',
      value: '₹10',
      type: 'Fixed',
      applicableOn: 'Per Order',
      status: 'Inactive'
    }
  ]);

  // Merchant Taxes State
  const [merchantTaxesEnabled, setMerchantTaxesEnabled] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState('all');
  
  // Available merchants list
  const merchants = [
    { id: 'all', name: 'All Merchants' },
    { id: 'pizza-palace', name: 'Pizza Palace' },
    { id: 'burger-king', name: 'Burger King' },
    { id: 'sweet-treats', name: 'Sweet Treats' },
    { id: 'quick-bites', name: 'Quick Bites' },
    { id: 'cake-corner', name: 'Cake Corner' },
    { id: 'night-owl-diner', name: 'Night Owl Diner' },
    { id: 'elite-eats', name: 'Elite Eats' },
    { id: 'cold-delights', name: 'Cold Delights' },
    { id: 'gourmet-express', name: 'Gourmet Express' }
  ];

  const [merchantTaxes, setMerchantTaxes] = useState([
    {
      id: 'MTX001',
      name: 'Local Tax',
      value: '5%',
      type: 'Percentage',
      applicableOn: 'Beverages',
      merchantName: 'Pizza Palace',
      status: 'Active'
    },
    {
      id: 'MTX002',
      name: 'State Tax',
      value: '8%',
      type: 'Percentage',
      applicableOn: 'All Items',
      merchantName: 'Burger King',
      status: 'Active'
    },
    {
      id: 'MTX003',
      name: 'Special Levy',
      value: '₹5',
      type: 'Fixed',
      applicableOn: 'Desserts',
      merchantName: 'Sweet Treats',
      status: 'Inactive'
    }
  ]);

  // Marketplace Packing Charges State
  const [marketplacePackingCharges, setMarketplacePackingCharges] = useState([
    {
      id: 'PC001',
      name: 'Standard Packaging',
      amount: '₹15',
      type: 'Fixed',
      applicableOn: 'All Orders',
      status: 'Active'
    },
    {
      id: 'PC002',
      name: 'Eco-Friendly Pack',
      amount: '₹25',
      type: 'Fixed',
      applicableOn: 'Opt-in Orders',
      status: 'Active'
    },
    {
      id: 'PC003',
      name: 'Premium Packaging',
      amount: '5%',
      type: 'Percentage',
      applicableOn: 'Orders > ₹500',
      status: 'Inactive'
    }
  ]);

  // Merchant Packing Charges State
  const [merchantPackingEnabled, setMerchantPackingEnabled] = useState(true);
  const [merchantPackingCharges, setMerchantPackingCharges] = useState([
    {
      id: 'MPC001',
      name: 'Custom Box',
      amount: '₹20',
      type: 'Fixed',
      applicableOn: 'Pizza Orders',
      merchantName: 'Pizza Palace',
      status: 'Active'
    },
    {
      id: 'MPC002',
      name: 'Insulated Bag',
      amount: '₹30',
      type: 'Fixed',
      applicableOn: 'Ice Cream',
      merchantName: 'Cold Delights',
      status: 'Active'
    },
    {
      id: 'MPC003',
      name: 'Branded Packaging',
      amount: '3%',
      type: 'Percentage',
      applicableOn: 'All Orders',
      merchantName: 'Gourmet Express',
      status: 'Inactive'
    }
  ]);

  // Marketplace Additional Charges State
  const [marketplaceAdditionalCharges, setMarketplaceAdditionalCharges] = useState([
    {
      id: 'AC001',
      name: 'Delivery Fee',
      amount: '₹40',
      type: 'Fixed',
      applicableOn: 'All Orders',
      status: 'Active'
    },
    {
      id: 'AC002',
      name: 'Peak Hour Surcharge',
      amount: '15%',
      type: 'Percentage',
      applicableOn: 'Peak Hours',
      status: 'Active'
    },
    {
      id: 'AC003',
      name: 'Distance Charge',
      amount: '₹5/km',
      type: 'Variable',
      applicableOn: 'Long Distance',
      status: 'Active'
    },
    {
      id: 'AC004',
      name: 'Rain Fee',
      amount: '₹20',
      type: 'Fixed',
      applicableOn: 'Bad Weather',
      status: 'Inactive'
    }
  ]);

  // Merchant Additional Charges State
  const [merchantAdditionalEnabled, setMerchantAdditionalEnabled] = useState(true);
  const [merchantAdditionalCharges, setMerchantAdditionalCharges] = useState([
    {
      id: 'MAC001',
      name: 'Express Delivery',
      amount: '₹60',
      type: 'Fixed',
      applicableOn: '< 30 min',
      merchantName: 'Quick Bites',
      status: 'Active'
    },
    {
      id: 'MAC002',
      name: 'Special Handling',
      amount: '10%',
      type: 'Percentage',
      applicableOn: 'Fragile Items',
      merchantName: 'Cake Corner',
      status: 'Active'
    },
    {
      id: 'MAC003',
      name: 'Late Night Fee',
      amount: '₹25',
      type: 'Fixed',
      applicableOn: 'After 11 PM',
      merchantName: 'Night Owl Diner',
      status: 'Active'
    },
    {
      id: 'MAC004',
      name: 'Premium Service',
      amount: '8%',
      type: 'Percentage',
      applicableOn: 'VIP Orders',
      merchantName: 'Elite Eats',
      status: 'Inactive'
    }
  ]);

  // Column definitions
  const taxColumns = [
    { key: 'id', label: 'Tax ID', sortable: true },
    { key: 'name', label: 'Tax Name', sortable: true },
    { key: 'value', label: 'Tax Value', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'applicableOn', label: 'Applicable On', sortable: true },
    { key: 'status', label: 'Status', sortable: false }
  ];

  const merchantTaxColumns = [
    { key: 'id', label: 'Tax ID', sortable: true },
    { key: 'name', label: 'Tax Name', sortable: true },
    { key: 'value', label: 'Tax Value', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'applicableOn', label: 'Applicable On', sortable: true },
    { key: 'merchantName', label: 'Merchant Name', sortable: true },
    { key: 'status', label: 'Status', sortable: false }
  ];

  const chargeColumns = [
    { key: 'id', label: 'Charge ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'applicableOn', label: 'Applicable On', sortable: true },
    { key: 'status', label: 'Status', sortable: false }
  ];

  const merchantChargeColumns = [
    { key: 'id', label: 'Charge ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'applicableOn', label: 'Applicable On', sortable: true },
    { key: 'merchantName', label: 'Merchant Name', sortable: true },
    { key: 'status', label: 'Status', sortable: false }
  ];

  // Handler functions
  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  const handleDelete = (item, setState, data) => {
    setState(data.filter((d) => d.id !== item.id));
  };

  const handleStatusToggle = (item, setState, data) => {
    setState(data.map((d) => 
      d.id === item.id 
        ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' }
        : d
    ));
  };

  const handleAddNew = (section) => {
    console.log('Add new:', section);
  };

  // Filter merchant taxes based on selected merchant
  const filteredMerchantTaxes = selectedMerchant === 'all' 
    ? merchantTaxes 
    : merchantTaxes.filter(tax => {
        const merchantName = tax.merchantName.toLowerCase().replace(/\s+/g, '-');
        return merchantName === selectedMerchant;
      });

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
              <h1 className="text-3xl font-bold text-gray-900">Orado Admin</h1>
              <p className="text-gray-600 mt-1">Tax & Charges Management Dashboard</p>
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
            onAddNew={() => handleAddNew('marketplace-tax')}
            icon={Receipt}
          />
          <DataTable
            data={marketplaceTaxes}
            columns={taxColumns}
            onEdit={handleEdit}
            onDelete={(item) => handleDelete(item, setMarketplaceTaxes, marketplaceTaxes)}
            onStatusToggle={(item) => handleStatusToggle(item, setMarketplaceTaxes, marketplaceTaxes)}
          />
        </section>

        {/* 2. Merchant Level Taxes */}
        <section>
          <SectionHeader
            title="Merchant Level Taxes"
            description="Manage taxes specific to individual merchants"
            buttonText="Add New Merchant Tax"
            onAddNew={() => handleAddNew('merchant-tax')}
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
              {/* Merchant Selector */}
              <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="merchant-select" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Merchant
                    </label>
                    <select
                      id="merchant-select"
                      value={selectedMerchant}
                      onChange={(e) => setSelectedMerchant(e.target.value)}
                      className="block w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {merchants.map((merchant) => (
                        <option key={merchant.id} value={merchant.id}>
                          {merchant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedMerchant === 'all' 
                      ? `Showing ${filteredMerchantTaxes.length} taxes from all merchants`
                      : `Showing ${filteredMerchantTaxes.length} taxes for ${merchants.find(m => m.id === selectedMerchant)?.name}`
                    }
                  </div>
                </div>
              </div>

            <DataTable
              data={filteredMerchantTaxes}
              columns={merchantTaxColumns}
              onEdit={handleEdit}
              onDelete={(item) => handleDelete(item, setMerchantTaxes, merchantTaxes)}
              onStatusToggle={(item) => handleStatusToggle(item, setMerchantTaxes, merchantTaxes)}
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
            onAddNew={() => handleAddNew('marketplace-packing')}
            icon={Package}
          />
          <DataTable
            data={marketplacePackingCharges}
            columns={chargeColumns}
            onEdit={handleEdit}
            onDelete={(item) => handleDelete(item, setMarketplacePackingCharges, marketplacePackingCharges)}
            onStatusToggle={(item) => handleStatusToggle(item, setMarketplacePackingCharges, marketplacePackingCharges)}
          />
        </section>

        {/* 4. Merchant Level Packing Charges */}
        <section>
          <SectionHeader
            title="Merchant Level Packing Charges"
            description="Manage packing charges specific to individual merchants"
            buttonText="Add New Merchant Packing Charge"
            onAddNew={() => handleAddNew('merchant-packing')}
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
            <DataTable
              data={merchantPackingCharges}
              columns={merchantChargeColumns}
              onEdit={handleEdit}
              onDelete={(item) => handleDelete(item, setMerchantPackingCharges, merchantPackingCharges)}
              onStatusToggle={(item) => handleStatusToggle(item, setMerchantPackingCharges, merchantPackingCharges)}
            />
          )}
        </section>

        {/* 5. Marketplace Level Additional Charges */}
        <section>
          <SectionHeader
            title="Marketplace Level Additional Charges"
            description="Manage additional charges applied at the marketplace level"
            buttonText="Add New Marketplace Additional Charge"
            onAddNew={() => handleAddNew('marketplace-additional')}
            icon={CreditCard}
          />
          <DataTable
            data={marketplaceAdditionalCharges}
            columns={chargeColumns}
            onEdit={handleEdit}
            onDelete={(item) => handleDelete(item, setMarketplaceAdditionalCharges, marketplaceAdditionalCharges)}
            onStatusToggle={(item) => handleStatusToggle(item, setMarketplaceAdditionalCharges, marketplaceAdditionalCharges)}
          />
        </section>

        {/* 6. Merchant Level Additional Charges */}
        <section>
          <SectionHeader
            title="Merchant Level Additional Charges"
            description="Manage additional charges specific to individual merchants"
            buttonText="Add New Merchant Additional Charge"
            onAddNew={() => handleAddNew('merchant-additional')}
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
            <DataTable
              data={merchantAdditionalCharges}
              columns={merchantChargeColumns}
              onEdit={handleEdit}
              onDelete={(item) => handleDelete(item, setMerchantAdditionalCharges, merchantAdditionalCharges)}
              onStatusToggle={(item) => handleStatusToggle(item, setMerchantAdditionalCharges, merchantAdditionalCharges)}
            />
          )}
        </section>

      </div>
    </div>
  );
}
export default TaxesFeesCharges;