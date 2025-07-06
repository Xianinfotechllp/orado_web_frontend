
import { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiMove,
  FiEdit,
  FiTrash2,
  FiArchive,
  FiCopy,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { addCategory, fetchCategoryProducts, fetchRestaurantCategories } from "../../../apis/adminApis/adminFuntionsApi";
// import apiClient from "../../../utils/apiClient"; // Make sure you have this import
import AddCategoryModal from "./AddCategoryModal";
import AddProductPage from "./AddProductPage";
const MerchantCataloguePage = () => {
  const { id } = useParams();
  const [activeFilter, setActiveFilter] = useState("approved");
  const [showItems, setShowItems] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState({
    categories: false,
    products: false
  });
  const [error, setError] = useState({
    categories: null,
    products: null
  });

    const [showModal, setShowModal] = useState(false);
 const [showAddProduct, setShowAddProduct] = useState(false);
  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(prev => ({...prev, categories: true}));
      setError(prev => ({...prev, categories: null}));
      
      try {
        const data = await fetchRestaurantCategories(id);
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]);
        }
      } catch (err) {
        setError(prev => ({...prev, categories: err.message}));
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(prev => ({...prev, categories: false}));
      }
    };

    fetchCategories();
  }, [id]);

  // Fetch products when selected category or filters change
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      setLoading(prev => ({...prev, products: true}));
      setError(prev => ({...prev, products: null}));
      
      try {
        const data = await fetchCategoryProducts(
          id, 
          selectedCategory._id, 
          activeFilter === "approved" ? "active" : activeFilter,
          searchQuery
        );
        console.log( data )
        setProducts(data);
        if (data.length > 0) {
          setSelectedProduct(data[0]);
        } else {
          setSelectedProduct(null);
        }
      } catch (err) {
        setError(prev => ({...prev, products: err.message}));
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(prev => ({...prev, products: false}));
      }
    };

    fetchProducts();
  }, [id, selectedCategory, activeFilter, searchQuery]);



  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };



 const handleAddCategory = async (categoryData) => {
  try {
    const payload = {
      name: categoryData.categoryName,   // map to name
      active: true,                      // or from form if present
      autoOnOff: false,                  // or from form if present
      description: categoryData.description,
      images: categoryData.image ? [categoryData.image] : [], // image as array
    };

    console.log("Final category payload:", payload);

    const response = await addCategory(id, payload);  // id from useParams or prop
    console.log("Category added:", response);

    // Optionally, refetch categories or update state
    setShowModal(false);
  } catch (error) {
    console.error("Error adding category:", error);
  }
};
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section (unchanged) */}
      {/* ... */}

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <span className="block mb-2">Filter products</span>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md ${
                activeFilter === "approved"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100"
              }`}
              onClick={() => setActiveFilter("approved")}
            >
              Approved
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeFilter === "pending"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100"
              }`}
              onClick={() => setActiveFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeFilter === "rejected"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100"
              }`}
              onClick={() => setActiveFilter("rejected")}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <span className="mr-2">Show Items</span>
          <select
            className="border rounded-md px-3 py-2"
            value={showItems}
            onChange={(e) => setShowItems(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search Product"
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Error messages */}
      {error.categories && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to load categories: {error.categories}
        </div>
      )}
      {error.products && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to load products: {error.products}
        </div>
      )}

      {/* Catalog Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Categories Column */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Category({categories.length})</h3>
            <div className="flex items-center">
              <FiPlus className="text-blue-600 cursor-pointer"  onClick={() => setShowModal(true)}    />
            </div>
          </div>
{showModal && (
  <AddCategoryModal
    onClose={() => setShowModal(false)}
    onAddCategory={handleAddCategory}
  />
)}
          {loading.categories ? (
            <div className="text-center py-4">Loading categories...</div>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`p-3 rounded-md flex justify-between items-center cursor-pointer ${
                    selectedCategory?.id === category.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className={category.active ? "font-medium" : "text-gray-500"}>
                    {category.name}
                  </span>
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                      {category.productCount || 0}
                    </span>
                    <div className="relative group">
                      <FiMoreVertical className="text-gray-500 cursor-pointer" />
                      {/* Dropdown menu remains the same */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Products Column */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Product ({products.length})</h3>
            <div className="flex items-center">
              <FiSearch className="text-gray-500 mr-2 cursor-pointer" />
              <div className="relative group">
                          <FiPlus className="text-blue-600 cursor-pointer"  onClick={() => setShowAddProduct(true)}    />
                {/* Dropdown menu remains the same */}
              </div>
            </div>
          </div>

          {loading.products ? (
            <div className="text-center py-4">Loading products...</div>
          ) : (
            <ul className="space-y-2">
              {products.map((product) => (
                <li
                  key={product.id}
                  className={`p-3 rounded-md flex justify-between items-center cursor-pointer ${
                    selectedProduct?.id === product.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <span className={product.active ? "font-medium" : "text-gray-500"}>
                    {product.name}
                  </span>
                  <div className="flex items-center">
                    <div className="relative group">
                      <FiMoreVertical className="text-gray-500 cursor-pointer" />
                      {/* Dropdown menu remains the same */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Product Details Column */}
        <div className="lg:w-2/4 bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold mb-4">Product Details</h3>

          {selectedProduct ? (
            <>
              <div className="flex flex-col md:flex-row mb-6">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <img
                    src={selectedProduct.images[0] || "https://via.placeholder.com/150"}
                    alt={selectedProduct.name}
                    className="w-full h-auto rounded-md cursor-pointer"
                  />
                </div>  
                <div className="md:w-2/3 md:pl-4">
                  <h4 className="text-xl font-bold mb-2">{selectedProduct.name}</h4>
                  <p className="text-lg font-semibold text-gray-700 mb-3">
                    ${selectedProduct.price}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {selectedProduct.description}
                    <span className="text-blue-600 ml-1 cursor-pointer">
                      read more
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">INVENTORY</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProduct.inventoryEnabled || false}
                      onChange={() =>
                        setSelectedProduct({
                          ...selectedProduct,
                          inventoryEnabled: !selectedProduct.inventoryEnabled,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Long Description</h4>
                <div className="text-gray-600">{selectedProduct.description}</div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {products.length === 0 ? "No products available" : "Select a product to view details"}
            </div>
          )}
        </div>
      </div>
       {showAddProduct && (
        <AddProductPage 
          onClose={() => setShowAddProduct(false)}
          merchantName="Meatshop"
           onAddProduct={(productData) => {
    // Handle the product data here
    console.log("Received product data:", productData);
    // You might want to add it to your state or send to an API
  }}
        />
      )}
    </div>
  );
};

export default MerchantCataloguePage;