import { useState, useEffect } from "react";
import {
  createProduct,
  getRestaurantProducts,
  deleteProduct,
  toggleProductStatus,
} from "../../../../apis/restaurantApi";
import { Plus, Edit, Trash2, Utensils } from "lucide-react";
import { toast } from "react-toastify";
import MenuAddModal from "./MenuAddModal";
import MenuEditModal from "./MenuEditModal";
import RestaurantSlider from "../Slider/RestaurantSlider";

const MenuManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedRestaurantIndex, setSelectedRestaurantIndex] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const currentRestaurantId = selectedRestaurant?.id || null;
  // Handle restaurants loaded from RestaurantSlider
  const handleRestaurantsLoad = (restaurantData) => {
    setRestaurants(restaurantData);
  };

  // Handle restaurant selection from RestaurantSlider
  const handleRestaurantSelect = async (restaurant, index) => {
    setSelectedRestaurant(restaurant);
    setSelectedRestaurantIndex(index);

    if (restaurant?.id) {
      await fetchRestaurantProducts(restaurant.id);
    }
  };

  const fetchRestaurantProducts = async (restaurantId) => {
    try {
      setLoading(true);
      const response = await getRestaurantProducts(restaurantId);
      console.log("Fetched products:-----------", response);

      // Handle various possible response structures
      const products = Array.isArray(response?.data?.products)
        ? response.data.products
        : Array.isArray(response?.products)
        ? response.products
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      // Keep ALL product fields instead of filtering them out
      const validatedProducts = products.map((product) => ({
        // Keep all original fields
        ...product,
        // Only add defaults for essential missing fields
        _id: product?._id || Math.random().toString(36).substring(2, 9),
        name: product?.name || "Unnamed Item",
        description: product?.description || "",
        price: product?.price ?? 0,
        images: Array.isArray(product?.images) ? product.images : [],
        active: product?.active !== false,
        foodType: product?.foodType || "Uncategorized",
        categoryId: product?.categoryId?._id || product?.categoryId || "",
        categoryName: product?.categoryId?.name || "Uncategorized",
        stock: product?.stock ?? "",
        reorderLevel: product?.reorderLevel ?? "",
        unit: product?.unit || "piece",
      }));

      console.log("Validated products: ", validatedProducts);

      setMenuItems(validatedProducts);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load restaurant products:", err);
      toast.error("Failed to load menu items");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (productId) => {
    try {
      setLoading(true);
      const response = await toggleProductStatus(productId);
      
      if (response?.product) {
        setMenuItems(prevItems => 
          prevItems.map(item => 
            item._id === productId 
              ? { ...item, active: response.product.active } 
              : item
          )
        );
        toast.success(`Item is now ${response.product.active ? 'available' : 'unavailable'}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle availability");
      console.error("Toggle error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (
      !id ||
      !window.confirm("Are you sure you want to delete this product?")
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await deleteProduct(id);

      if (response?.message?.includes("deleted successfully")) {
        toast.success("Product deleted successfully");
        setMenuItems((prev) => prev.filter((item) => item._id !== id));
      } else if (response?.message?.includes("permission")) {
        toast.info(
          "Your deletion request has been submitted for admin approval"
        );
      } else {
        throw new Error(response?.message || "Failed to delete product");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to delete product"
      );
    } finally {
      setLoading(false);
    }
  };

  // const toggleAvailability = (id) => {
  //   setMenuItems((items) =>
  //     items.map((item) =>
  //       item._id === id ? { ...item, active: !item.active } : item
  //     )
  //   );
  // };

  const handleCreateProduct = async (productData) => {
    try {
      if (!currentRestaurantId) throw new Error("No restaurant selected");

      const response = await createProduct(currentRestaurantId, productData);
      const newProduct =
        response?.data?.product || response?.product || productData;

      setMenuItems((prev) => [
        ...prev,
        {
          _id: newProduct?._id || Math.random().toString(36).substring(2, 9),
          name: newProduct?.name || "New Item",
          description: newProduct?.description || "",
          price: newProduct?.price || 0,
          images: Array.isArray(newProduct?.images) ? newProduct.images : [],
          active: newProduct?.active !== false,
          foodType: newProduct?.foodType || "Uncategorized",
        },
      ]);

      setShowAddModal(false);
      toast.success("Menu item created successfully");
      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create product"
      );
      throw error;
    }
  };

  const handleAddMenuClick = () => {
    if (currentRestaurantId) {
      setShowAddModal(true);
    } else {
      toast.warning("Please select a restaurant first");
    }
  };

  const handleUpdateSuccess = (updatedProduct) => {
  if (!updatedProduct?._id) return;

  setMenuItems(prevItems => 
    prevItems.map(item => 
      item._id === updatedProduct._id
        ? {
            ...item,
            ...updatedProduct,
            // Ensure all critical fields are properly set
            name: updatedProduct.name || item.name,
            price: updatedProduct.price ?? item.price,
            description: updatedProduct.description || item.description,
            foodType: updatedProduct.foodType || item.foodType,
            categoryId: updatedProduct.categoryId || item.categoryId,
            categoryName: updatedProduct.categoryName || item.categoryName,
            stock: updatedProduct.stock ?? item.stock,
            reorderLevel: updatedProduct.reorderLevel ?? item.reorderLevel,
            unit: updatedProduct.unit || item.unit,
            images: Array.isArray(updatedProduct.images) 
              ? updatedProduct.images 
              : item.images,
            active: updatedProduct.active !== false,
          }
        : item
    )
  );
  
  // Only close modal if we're not in optimistic update phase
  if (!updatedProduct.isOptimistic) {
    setEditingProduct(null);
    setShowEditModal(false);
  }
};

  if (loading && restaurants.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Restaurant Slider - Using the reusable component */}
      <RestaurantSlider
        onRestaurantSelect={handleRestaurantSelect}
        onRestaurantsLoad={handleRestaurantsLoad}
        selectedIndex={selectedRestaurantIndex}
        className=""
        showError={true}
      />

      {/* Menu Items Grid */}
      {loading && menuItems.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : menuItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {menuItems.map((item) => (
      <div
        key={item._id}
        className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="relative aspect-square">
          <img
            src={item.images?.[0] || "/placeholder.svg"}
            alt={item.name}
            className="w-full h-full object-cover bg-gray-100"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
        </div>

        <div className="p-3">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                {item.name}
              </h3>
              <span className="text-sm font-bold text-orange-600 whitespace-nowrap">
                ₹{item.price}
              </span>
            </div>

            <p className="text-gray-600 text-xs line-clamp-2">
              {item.description}
            </p>

            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
              {item.foodType}
            </span>

            {/* Toggle switch and action buttons container */}
            <div className="flex items-center justify-between pt-2">
              {/* Toggle switch */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {item.active ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleToggleAvailability(item._id)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                    item.active ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      item.active ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingProduct(item);
                    setShowEditModal(true);
                  }}
                  className="border border-gray-300 px-2 py-1 text-xs rounded hover:bg-gray-50"
                >
                  <Edit className="w-3 h-3" />
                </button>

                <button
                  className="border border-red-300 px-2 py-1 text-xs rounded text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No menu items found</div>
          <p className="text-gray-500">
            Add your first menu item to get started
          </p>
        </div>
      )}

      {/* Add New Item Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <button
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl"
          onClick={handleAddMenuClick}
          disabled={!currentRestaurantId || loading}
        >
          {loading ? (
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <>
              <Utensils className="w-6 h-6 mr-2" />
              <span className="text-white font-medium">Add Menu</span>
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      {showAddModal && currentRestaurantId && (
        <MenuAddModal
          restaurantId={currentRestaurantId}
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreateProduct}
          categories={categories}
        />
      )}

      {showEditModal && editingProduct && (
        <MenuEditModal
          restaurantId={currentRestaurantId}
          initialData={editingProduct}
          onClose={() => setShowEditModal(false)}
          onUpdateSuccess={handleUpdateSuccess}
          categories={categories}
        />
      )}
    </div>
  );
};

export default MenuManagement;
