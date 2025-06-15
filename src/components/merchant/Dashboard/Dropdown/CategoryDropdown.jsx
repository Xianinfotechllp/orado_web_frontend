import React, { useEffect, useState } from "react";
import { getRestaurantCategories } from "../../../../apis/restaurantApi";
import { toast } from "react-toastify";

const CategoryDropdown = ({ 
  restaurantId, 
  onCategorySelect, 
  selectedCategory 
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!restaurantId) {
        console.log("No restaurant ID provided");
        setCategories([]);
        return;
      }
      
      console.log("Fetching categories for restaurant:", restaurantId);
      
      try {
        setLoading(true);
        setError(null);
        const response = await getRestaurantCategories(restaurantId);
        console.log("API Response:", response);
        
        // Updated data access - uses response.data instead of response.categories
        const categoriesData = Array.isArray(response?.data) ? response.data : [];
        console.log("Processed categories:", categoriesData);
        
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError(err.response?.data?.message || "Failed to load categories");
        toast.error("Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [restaurantId]);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    if (onCategorySelect) {
      onCategorySelect(selectedId);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-2 border rounded bg-gray-100 text-gray-500">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-2 border rounded bg-red-50 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <select
      name="categoryId"
      value={selectedCategory || ""}
      onChange={handleChange}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      disabled={loading || error || categories.length === 0}
    >
      <option value="">{categories.length === 0 ? "No categories available" : "Select category"}</option>
      {categories.map(category => (
        <option 
          key={category?._id || Math.random().toString(36).substring(2, 9)} 
          value={category?._id}
        >
          {category?.name || "Unnamed Category"}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;