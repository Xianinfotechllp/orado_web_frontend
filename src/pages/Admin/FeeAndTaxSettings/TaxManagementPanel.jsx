import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, RefreshCw } from 'lucide-react';

const TaxManagementPanel = () => {
  const [taxes, setTaxes] = useState([
    { id: 1, name: 'Food GST', percentage: 5, applicableFor: 'food', status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'Beverage Tax', percentage: 12, applicableFor: 'beverages', status: 'active', createdAt: '2024-01-16' },
    { id: 3, name: 'Delivery Charge Tax', percentage: 18, applicableFor: 'deliveryFee', status: 'inactive', createdAt: '2024-01-17' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    { value: 'food', label: 'Food Items', color: 'bg-green-100 text-green-800' },
    { value: 'beverages', label: 'Beverages', color: 'bg-blue-100 text-blue-800' },
    { value: 'meat', label: 'Meat Products', color: 'bg-red-100 text-red-800' },
    { value: 'grocery', label: 'Grocery', color: 'bg-purple-100 text-purple-800' },
    { value: 'deliveryFee', label: 'Delivery Fee', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'commission', label: 'Commission', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'agent', label: 'Agent Fee', color: 'bg-pink-100 text-pink-800' },
  ];

  const getCategoryInfo = (value) => categories.find(cat => cat.value === value) || { label: value, color: 'bg-gray-100 text-gray-800' };

  const filteredTaxes = taxes.filter(tax => {
    const matchesSearch = tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getCategoryInfo(tax.applicableFor).label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tax.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || tax.applicableFor === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddTax = () => {
    setEditingTax(null);
    setIsModalOpen(true);
  };

  const handleEditTax = (tax) => {
    setEditingTax(tax);
    setIsModalOpen(true);
  };

  const handleDeleteTax = (id) => {
    if (window.confirm('Are you sure you want to delete this tax?')) {
      setTaxes(taxes.filter(tax => tax.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setTaxes(taxes.map(tax => 
      tax.id === id 
        ? { ...tax, status: tax.status === 'active' ? 'inactive' : 'active' }
        : tax
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tax Management</h1>
              <p className="text-gray-600 mt-1">Manage taxes for your food delivery platform</p>
            </div>
            <button
              onClick={handleAddTax}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Tax
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search taxes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Filter className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Taxes</p>
                <p className="text-2xl font-bold text-gray-900">{taxes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Taxes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {taxes.filter(tax => tax.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="w-6 h-6 bg-yellow-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Inactive Taxes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {taxes.filter(tax => tax.status === 'inactive').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(taxes.map(tax => tax.applicableFor)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Tax Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Percentage</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTaxes.map(tax => {
                  const categoryInfo = getCategoryInfo(tax.applicableFor);
                  return (
                    <tr key={tax.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{tax.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-semibold text-gray-900">{tax.percentage}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(tax.id)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            tax.status === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {tax.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {tax.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTax(tax)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Tax"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTax(tax.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Tax"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTaxes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No taxes found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <TaxModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(taxData) => {
            if (editingTax) {
              setTaxes(taxes.map(tax => 
                tax.id === editingTax.id 
                  ? { ...tax, ...taxData }
                  : tax
              ));
            } else {
              const newTax = {
                ...taxData,
                id: Math.max(...taxes.map(t => t.id)) + 1,
                status: 'active',
                createdAt: new Date().toISOString().split('T')[0]
              };
              setTaxes([...taxes, newTax]);
            }
            setIsModalOpen(false);
          }}
          taxToEdit={editingTax}
          categories={categories}
        />
      )}
    </div>
  );
};

const TaxModal = ({ isOpen, onClose, onSave, taxToEdit, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    percentage: '',
    applicableFor: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (taxToEdit) {
      setFormData({
        name: taxToEdit.name,
        percentage: taxToEdit.percentage.toString(),
        applicableFor: taxToEdit.applicableFor
      });
    } else {
      setFormData({ name: '', percentage: '', applicableFor: '' });
    }
    setErrors({});
  }, [taxToEdit, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tax name is required';
    }
    
    if (!formData.percentage) {
      newErrors.percentage = 'Percentage is required';
    } else if (isNaN(formData.percentage) || formData.percentage < 0 || formData.percentage > 100) {
      newErrors.percentage = 'Percentage must be between 0 and 100';
    }
    
    if (!formData.applicableFor) {
      newErrors.applicableFor = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        percentage: parseFloat(formData.percentage),
        applicableFor: formData.applicableFor
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {taxToEdit ? 'Edit Tax' : 'Add New Tax'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Food GST"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percentage (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.percentage}
              onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
              placeholder="0.00"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.percentage ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.percentage && <p className="mt-1 text-sm text-red-600">{errors.percentage}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applies To
            </label>
            <select
              value={formData.applicableFor}
              onChange={(e) => setFormData({ ...formData, applicableFor: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.applicableFor ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.applicableFor && <p className="mt-1 text-sm text-red-600">{errors.applicableFor}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {taxToEdit ? 'Update Tax' : 'Add Tax'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxManagementPanel;