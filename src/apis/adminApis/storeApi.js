import axios from "axios";
import apiClient from "../apiClient/apiClient";

export const createStore = async (storeData) => {
  const formData = new FormData();

  // Append all basic fields except arrays/files
  Object.keys(storeData).forEach(key => {
    if (key !== 'address' && 
        key !== 'openingHours' && 
        key !== 'images' && 
        key !== 'fssaiDoc' && 
        key !== 'gstDoc' && 
        key !== 'aadharDoc' &&
        key !== 'commission' &&
        key !== 'paymentMethods') {
      formData.append(key, storeData[key]);
    }
  });

  // Append paymentMethods as individual fields
  storeData.paymentMethods.forEach(method => {
    formData.append('paymentMethods', method);
  });

  // Append complex objects as JSON strings
  formData.append("address", JSON.stringify(storeData.address));
  formData.append("openingHours", JSON.stringify(storeData.openingHours));
  formData.append("commission", JSON.stringify(storeData.commission));

  // Append images (multiple)
  storeData.images.forEach((file) => {
    formData.append("images", file);
  });

  // Append KYC documents
  formData.append("fssaiDoc", storeData.fssaiDoc);
  formData.append("gstDoc", storeData.gstDoc);
  formData.append("aadharDoc", storeData.aadharDoc);

  try {
    const response = await apiClient.post("/store/register", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating store:", {
      request: error.config,
      response: error.response?.data
    });
    throw error.response?.data || { message: "Request failed" };
  }
};








export const getStoreById = async (id) => {
  try {
    const response = await apiClient.get(`/store/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch restaurant by ID:", error);
    throw error;
  }
}

export const createProduct = async (productData, storeId, categoryId) => {
  try {
    const formData = new FormData();
    
    // Log for debugging
    console.log('Raw productData:', productData);
    console.log('Images array:', productData.images);

    // Append all basic product data
    formData.append('name', productData.name);
    formData.append('description', productData.description || '');
    formData.append('price', productData.price);
    formData.append('storeId', storeId);
    formData.append('categoryId', categoryId);
    formData.append('preparationTime', productData.preparationTime || 10);
    formData.append('availability', productData.availability?.type || 'always');
    
    if (productData.availability?.type === 'time-based' || productData.availability?.type === 'scheduled') {
      formData.append('availableAfterTime', productData.availableFromTime || '17:00');
    }
    
    formData.append('unit', productData.unit || 'piece');
    formData.append('stock', productData.stock || 0);
    formData.append('reorderLevel', productData.reorderLevel || 0);
    formData.append('enableInventory', productData.enableInventory || false);
    formData.append('foodType', productData.foodType || 'veg');
    formData.append('costPrice', productData.costPrice || 0);
    formData.append('minimumOrderQuantity', productData.minQty || 1);
    formData.append('maximumOrderQuantity', productData.maxQty || 100);

    // Handle image uploads
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image, index) => {
        if (image instanceof File) {
          // Append each image with a unique name
          formData.append(`images`, image);
          // Alternatively, if your backend expects specific names:
          // formData.append(`images[${index}]`, image);
        } else if (typeof image === 'string') {
          // If editing and image is a URL string, you might need to handle differently
          console.warn('Skipping existing image URL - only new uploads are supported');
        }
      });
    } else {
      console.log('No images to upload');
    }

    // Log FormData contents for debugging (note: can't directly console.log FormData)
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? value.name : value);
    }

    const response = await apiClient.post('/store/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // This is crucial for file uploads
      }
    });

    return response.data;
  } catch (error) {
    console.error('Create product failed:', error.response?.data || error.message);
    throw error;
  }
};











export const updateProductById = async (id, productData, imagesToRemove, newImages) => {
  const formData = new FormData();

  // Append product fields
  formData.append('name', productData.name);
  formData.append('description', productData.description || '');
  formData.append('price', productData.price);
  formData.append('unit', productData.unit || 'piece');
  formData.append('costPrice', productData.costPrice || 0);
  formData.append('minimumOrderQuantity', productData.minimumOrderQuantity || 1);
  formData.append('maximumOrderQuantity', productData.maximumOrderQuantity || 100);
  formData.append('preparationTime', productData.preparationTime || 0);
  formData.append('reorderLevel', productData.reorderLevel || 0);
  formData.append('stock', productData.stock || 0);
  formData.append('enableInventory', productData.enableInventory);
  formData.append('foodType', productData.foodType || 'veg');
  formData.append('availability', productData.availability || 'always');
  formData.append('availableAfterTime', productData.availableAfterTime || '');
  formData.append('isRecurring', productData.isRecurring || false);

  // ✅ Append imagesToRemove as a JSON string
  if (imagesToRemove && imagesToRemove.length > 0) {
    formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
  }

  // ✅ Append new images — must use 'images' to match Multer config
  newImages.forEach(file => formData.append('images', file));

  // ✅ Make PATCH request
  const response = await apiClient.patch(`/store/product/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};




export const updateCategoryById = async (id, categoryData, imagesToRemove = [], newImages = []) => {
  const formData = new FormData();

  // Add basic fields
  if (categoryData.name) formData.append('name', categoryData.name);
  if (categoryData.description) formData.append('description', categoryData.description);
  if (categoryData.restaurantId) formData.append('restaurantId', categoryData.restaurantId);
  formData.append('active', categoryData.active);
  formData.append('autoOnOff', categoryData.autoOnOff);

  // Add imagesToRemove (as JSON string)
  if (imagesToRemove.length > 0) {
    formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
  }

  // Append new images (files)
  newImages.forEach((imageFile) => {
    formData.append('images', imageFile); // must match `upload.array('images')` field
  });

  // Send PATCH request
  const response = await apiClient.patch(`/store/category/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};  



export const createCategory = async (categoryData, imageFiles = []) => {
  try {
    const formData = new FormData();

    // Append text fields
    if (categoryData.name) formData.append('name', categoryData.name);
    if (categoryData.restaurantId) formData.append('restaurantId', categoryData.restaurantId);
    if (categoryData.availability) formData.append('availability', categoryData.availability);
    if (categoryData.availableAfterTime) formData.append('availableAfterTime', categoryData.availableAfterTime);
    if (categoryData.description) formData.append('description', categoryData.description);
    formData.append('active', categoryData.active);
    formData.append('autoOnOff', categoryData.autoOnOff);

    // Append image files
    imageFiles.forEach(file => {
      formData.append('images', file); // matches upload.array('images') on backend
    });

    const response = await apiClient.post('/store/category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // success response
  } catch (error) {
    console.error('Error creating category:', error);
    // Optional: throw custom error or return fallback
    throw error.response?.data || { message: 'Unexpected error occurred' };
  }
};

export const deleteCategory = async (id, categoryData, imagesToRemove = [], newImages = []) => {
  const formData = new FormData();

  // Add basic fields
  if (categoryData.name) formData.append('name', categoryData.name);
  if (categoryData.description) formData.append('description', categoryData.description);
  if (categoryData.restaurantId) formData.append('restaurantId', categoryData.restaurantId);
  formData.append('active', categoryData.active);
  formData.append('autoOnOff', categoryData.autoOnOff);

  // Add imagesToRemove (as JSON string)
  if (imagesToRemove.length > 0) {
    formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
  }

  // Append new images (files)
  newImages.forEach((imageFile) => {
    formData.append('images', imageFile); // must match `upload.array('images')` field
  });

  // Send PATCH request
  const response = await apiClient.patch(`/store/category/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};  



export const toggleCategoryActiveStatus = async (id, categoryData, imagesToRemove = [], newImages = []) => {
  const formData = new FormData();

  // Add basic fields
  if (categoryData.name) formData.append('name', categoryData.name);
  if (categoryData.description) formData.append('description', categoryData.description);
  if (categoryData.restaurantId) formData.append('restaurantId', categoryData.restaurantId);
  formData.append('active', categoryData.active);
  formData.append('autoOnOff', categoryData.autoOnOff);

  // Add imagesToRemove (as JSON string)
  if (imagesToRemove.length > 0) {
    formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
  }

  // Append new images (files)
  newImages.forEach((imageFile) => {
    formData.append('images', imageFile); // must match `upload.array('images')` field
  });

  // Send PATCH request
  const response = await apiClient.patch(`/store/category/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};  



export const updateCategory = async (id, categoryData, imagesToRemove = [], newImages = []) => {
  const formData = new FormData();

  // Add basic fields
  if (categoryData.name) formData.append('name', categoryData.name);
  if (categoryData.description) formData.append('description', categoryData.description);
  if (categoryData.restaurantId) formData.append('restaurantId', categoryData.restaurantId);
  formData.append('active', categoryData.active);
  formData.append('autoOnOff', categoryData.autoOnOff);

  // Add imagesToRemove (as JSON string)
  if (imagesToRemove.length > 0) {
    formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
  }

  // Append new images (files)
  newImages.forEach((imageFile) => {
    formData.append('images', imageFile); // must match `upload.array('images')` field
  });

  // Send PATCH request
  const response = await apiClient.patch(`/store/category/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};  










export const toggleProductStatus = async (productId) => {
  try {                                           
    const response = await apiClient.patch(`/store/product/${productId}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling product status:', error);
    throw error.response?.data || { message: 'Unknown error' };
  }
};

// Delete Product
export const deleteProduct = async (productId, restaurantId) => {
  try {
    const response = await apiClient.delete(`/store/product/${productId}`, {
      data: { restaurantId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error.response?.data || { message: 'Unknown error' };
  }
};