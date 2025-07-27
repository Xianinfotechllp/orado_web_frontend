import React from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const ProductDetailsCard = ({ product, onToggleStatus }) => {
  if (!product) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-[320px] flex flex-col items-center justify-center h-full">
        <Info size={24} className="text-gray-400 mb-3" />
        <h2 className="text-lg font-semibold text-gray-700 mb-1">Product Details</h2>
        <p className="text-gray-500 text-sm text-center">
          Select a product to view detailed information
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-[320px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-100">
        Product Details
      </h2>

      <div className="flex items-start mb-6">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/100?text=No+Image'}
          alt={product.name}
          className="w-20 h-20 rounded-lg object-cover mr-4 border border-gray-200"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg mb-1">{product.name}</h3>
          <p className="text-indigo-600 font-bold text-xl mb-2">₹{product.price}</p>
          {product.category && (
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {product.category.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
        <div>
          <span className="block text-sm font-medium text-gray-600 mb-1">Status</span>
          <div className="flex items-center">
            {product.active ? (
              <CheckCircle2 size={16} className="text-green-500 mr-1" />
            ) : (
              <XCircle size={16} className="text-red-500 mr-1" />
            )}
            <span className={product.active ? "text-green-600" : "text-red-600"}>
              {product.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <button
          onClick={() => onToggleStatus(product._id)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            product.active
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-green-50 text-green-600 hover:bg-green-100"
          }`}
        >
          {product.active ? "Deactivate" : "Activate"}
        </button>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {product.description || 'No description available.'}
        </p>
      </div>

      {product.ingredients && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients</h4>
          <p className="text-gray-600 text-sm">{product.ingredients}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="block text-gray-500 font-medium mb-1">Created</span>
          <span className="text-gray-600">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span className="block text-gray-500 font-medium mb-1">Last Updated</span>
          <span className="text-gray-600">
            {new Date(product.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;