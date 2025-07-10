import React, { useEffect, useState } from 'react';
import { getCategoryProducts } from '../../../../apis/restaurantApi';
import { MoreVertical, Edit, Trash2, Plus, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductList = ({ 
  selectedRestaurant, 
  selectedCategory, 
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleStatus,
  categories,
  onAddProductClick
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    if (!selectedRestaurant || !selectedCategory) return;
    
    setLoading(true);
    try {
      const data = await getCategoryProducts(selectedRestaurant.id, selectedCategory._id);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedRestaurant, selectedCategory]);

  const handleEditClick = (product, e) => {
    e.stopPropagation();
    onEditProduct(product);
  };

  const handleDeleteClick = async (productId, e) => {
    e.stopPropagation();
    onDeleteProduct(productId);
  };

  const handleToggleStatus = async (productId, e) => {
    e.stopPropagation();
    onToggleStatus(productId);
  };

  const handleAddProductClick = (e) => {
    e.stopPropagation();
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }
    onAddProductClick(selectedCategory._id);
  };

  if (!selectedCategory) {
    return (
      <div className="flex items-center justify-center h-full p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-center">
          Select a category to view products
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 w-[280px] flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedCategory.name}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({products.length} items)
          </span>
        </h2>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleAddProductClick}
            className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            title="Add new product"
          >
            <Plus size={18} strokeWidth={2} />
          </button>
          <button 
            className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            onClick={() => onSelectProduct(null)}
            title="View all"
          >
            <Search size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {loading && !products.length ? (
        <div className="flex flex-1 items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Plus size={24} className="text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">No products found</p>
              <button
                onClick={handleAddProductClick}
                className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Add your first product
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    !product.active 
                      ? 'bg-gray-50 border border-gray-200' 
                      : 'hover:bg-indigo-50 border border-transparent hover:border-indigo-100'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      !product.active ? 'text-gray-500' : 'text-gray-800'
                    }`}>
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{product.price}
                      {product.description && (
                        <span className="ml-2 truncate">· {product.description}</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center ml-2 space-x-1">
                    <button 
                      onClick={(e) => handleEditClick(product, e)}
                      className="p-1.5 rounded-full hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      <Edit size={16} strokeWidth={2} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteClick(product._id, e)}
                      className="p-1.5 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;