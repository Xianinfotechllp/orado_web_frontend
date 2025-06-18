import apiClient from "./apiClient/apiClient";

// Fetch restaurant menu
export const getRestaurantMenu = async (restaurantId, options = {}) => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}/menu`, {
      params: {
        categoryLimit: options.categoryLimit || 10,
        productPage: options.productPage || 10,
        productLimit: options.productLimit || 30,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant menu:", error);
    throw error;
  }
};

// Fetch recommended restaurants nearby
export const getRecommendedRestaurants = async (latitude, longitude) => {
  try {
    const response = await apiClient.get("/location/nearby-restaurants/recommended", {
      params: { latitude, longitude },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended restaurants:", error);
    throw error;
  }
};

// Fetch nearby categories
export const getNearbyCategories = async (latitude, longitude) => {
  try {
    const response = await apiClient.get("/location/nearby-categories", {
      params: { latitude, longitude },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby categories:", error);
    throw error;
  }
};

// Fetch restaurant details by ID
export const getRestaurantById = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch restaurant by ID:", error);
    throw error;
  }
};



// fetch retruants by category and location
export const getRestaurantsByLocationAndCategory = async (latitude, longitude, categoryName, distance = 5000) => {
  try {
    const response = await apiClient.get(`/location/nearby-restaurants/category/${categoryName}`, {
      params: { latitude, longitude, distance },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants by location and category:", error);
    throw error;
  }
};

// search bar api method

export const getRestaurantsBySearchQuery = async ({
  query,
  latitude,
  longitude,
  radius = 5000,
  page = 1,
  limit = 10
}) => {
  try {
    const response = await apiClient.get("/location/nearby/restaurants/search", {
      params: {
        query,
        latitude,
        longitude,
        radius,
        page,
        limit
      }
    });
    console.log("Search response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching restaurants:", error);
    throw error;
  }
};



// creating restaurant 
export const createRestaurant = async (formData) => {
  try {
    console.log("Creating restaurant with data:");
    // Log form data contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    const response = await apiClient.post('/restaurants/register-restaurant', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("Restaurant created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating restaurant:", error.response?.data || error.message);
    throw error;
  }
};


export const updateRestaurant = async (restaurantId, formData) => {
  try {
    console.log("Updating restaurant with data:");
    // Log form data contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    const response = await apiClient.put(`/restaurants/${restaurantId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("Restaurant updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating restaurant:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteRestaurant = async (restaurantId) => {
  try {
    const response = await apiClient.delete(`/restaurants/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("restaurant deletion error:", error.response?.data || error.message);
    throw error;
  }
};



export const getMyRestaurantProducts = async (filters = {}) => {
  try {
    const response = await apiClient.get('/restaurants/products', {
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant products:", error.response?.data || error.message);
    throw error;
  }
};




// MERCHANT SECTION
// registration on merchant 
export const registerMerchant = async (data) => {
  try {
    const response = await apiClient.post('/restaurants/register-merchant', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginMerchant = async (credentials) => {
  try {
    const response = await apiClient.post('/restaurants/login', credentials);
    return response.data;
  } catch (error) {
    console.error("Merchant login error:", error.response?.data || error.message);
    throw error;
  }
};

export const logoutMerchant = async () => {
  try {
    const response = await apiClient.post('/restaurants/logout');
    return response.data;
  } catch (error) {
    console.error("Merchant logout error:", error.response?.data || error.message);
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const response = await apiClient.post('/merchant/change-password', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMerchantDetails = async (merchantId) => {
  try {
    const response = await apiClient.get(`/restaurants/${merchantId}`);
    console.log("Fetched merchant details:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching merchant restaurants:", error.response?.data || error.message);
    throw error;
  }
};


// apiClient.js or similar file
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post(`/restaurants/reset-password/${token}`, { newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMerchantRestaurants = async (merchantId) => {
  try {
    const response = await apiClient.get(`/restaurants/merchant/${merchantId}/restaurants`);
    return response.data;
  } catch (error) {
    console.error("Error fetching merchant restaurants:", error.response?.data || error.message);
    throw error;
  }
};


export const createProduct = async (restaurantId, productData) => {
  try {
    const formData = new FormData();
    
    // Append all product data to formData
    Object.keys(productData).forEach(key => {
      if (key === 'images' && productData[key]) {
        // Append each image file
        productData[key].forEach(file => {
          formData.append('images', file);
        });
      } else if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });

    const response = await apiClient.post(`/restaurants/${restaurantId}/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Product creation error:", error.response?.data || error.message);
    throw error;
  }
};


export const getRestaurantProducts = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant products:", error.response?.data || error.message);
    throw error;
  }
};

// update menu

export const updateProduct = async (productId, productData) => {
  try {
    const formData = new FormData();
    
    // Append all non-file fields
    Object.keys(productData).forEach(key => {
      if (key !== 'newImages' && key !== 'imagesToDelete' && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });

    // Append new images
    if (productData.newImages && productData.newImages.length > 0) {
      productData.newImages.forEach(file => {
        formData.append('images', file);
      });
    }

    // Append images to delete if any
    if (productData.imagesToDelete && productData.imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(productData.imagesToDelete));
    }

    const response = await apiClient.put(`/restaurants/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
   
    console.error("Product update error:", error.response?.data || error.message);
    
    // Extract the error message to show in toast
    const errorMessage = error.response?.data?.message || 
                        "Failed to update product. Please try again.";
    
    // Throw an object containing both the error and the message
    throw {
      error,
      message: errorMessage
    };
  }
};


export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/restaurants/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Product deletion error:", error.response?.data || error.message);
    throw error;
  }
};




export const createCategory = async (restaurantId, categoryData, imageFile) => {
  try {
    const formData = new FormData();
    
    // Append only the fields that backend expects
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description);
    
    if (imageFile) {
      formData.append('images', imageFile);
    }

    // For debugging - log the actual contents
    console.log("Creating category with data:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }


    const response = await apiClient.post(
      `/restaurants/${restaurantId}/categories`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error.response?.data || error.message);
    throw error;
  }
};

export const getRestaurantCategories = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant categories:", error.response?.data || error.message);
    throw error;
  }
};


// src/services/categoryService.js
export const editRestaurantCategory = async (restaurantId, categoryId, categoryData, imageFile) => {
  try {
    const formData = new FormData();
    
    formData.append('restaurantId', restaurantId);
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description);
    
    // ONLY append image if a new file is actually selected
    if (imageFile && imageFile instanceof File) {
      formData.append('images', imageFile);
      console.log("New image file added to FormData");
    } else {
      console.log("No new image file - preserving existing image");
    }

    // For debugging - log the actual contents
    console.log("Updating category with data:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await apiClient.put(
      `/restaurants/categories/${categoryId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteRestaurantCategory = async (categoryId, restaurantId) => {
  try {
    const response = await apiClient.delete(`/restaurants/${restaurantId}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting restaurant category:", error.response?.data || error.message);
    throw error;
  }
};


// Earning section in merchant for each of the restaurantId

export const getRestaurantEarningSummary = async (restaurantId, timeFrame = '') => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}/earnigs`, {
      params: { 
        period: timeFrame,
        page: 1,
        limit: 1000 // Adjust based on your needs
      }
    });
    
    // Transform the backend response to match frontend expectations
    const { data, summary } = response.data;
    
    // Calculate statistics from the data
    const totalOrders = data.length;
    const totalAmount = summary.totalOrderAmount;
    const totalCommission = summary.totalCommission;
    const totalNetEarnings = summary.totalNetRevenue;
    const averageCommissionRate = totalOrders > 0 ? 
      ((totalCommission / totalAmount) * 100).toFixed(2) : 0;
    
    // Count payout statuses
    const payoutStatusCounts = data.reduce((acc, item) => {
      acc[item.payoutStatus] = (acc[item.payoutStatus] || 0) + 1;
      return acc;
    }, {});
    
    // Count commission types
    const percentageCommissionOrders = data.filter(
      item => item.commissionType === 'percentage'
    ).length;
    const fixedCommissionOrders = data.filter(
      item => item.commissionType === 'fixed'
    ).length;
    
    // Create breakdown data based on time frame
    let monthlyBreakdown = [];
    let dailyBreakdown = [];
    let weeklyBreakdown = [];
    
    if (timeFrame === 'year') {
      monthlyBreakdown = Array(12).fill().map((_, i) => {
        const monthData = data.filter(item => 
          new Date(item.orderDate).getMonth() === i
        );
        return {
          month: i + 1,
          totalNetEarnings: monthData.reduce((sum, item) => sum + item.netRevenue, 0)
        };
      });
    } else if (timeFrame === 'month') {
      dailyBreakdown = Array(31).fill().map((_, i) => {
        const dayData = data.filter(item => 
          new Date(item.orderDate).getDate() === i + 1
        );
        return {
          day: i + 1,
          totalNetEarnings: dayData.reduce((sum, item) => sum + item.netRevenue, 0)
        };
      });
    } else if (timeFrame === 'week') {
      weeklyBreakdown = Array(7).fill().map((_, i) => {
        const dayData = data.filter(item => 
          new Date(item.orderDate).getDay() === i
        );
        return {
          dayOfWeek: i + 1,
          totalNetEarnings: dayData.reduce((sum, item) => sum + item.netRevenue, 0)
        };
      });
    }
    
    return {
      summary: {
        totalOrders,
        totalAmount,
        totalCommission,
        totalNetEarnings,
        averageCommissionRate,
        payoutStatusCounts,
        percentageCommissionOrders,
        fixedCommissionOrders,
        currency: 'INR',
        monthlyBreakdown,
        dailyBreakdown,
        weeklyBreakdown
      },
      data
    };
    
  } catch (error) {
    console.error("Error fetching restaurant earnings:", error.response?.data || error.message);
    throw error;
  }
};



// feedback section get 
export const getRestaurantReviews = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/feedback/restaurants/${restaurantId}`);
    console.log("Fetched restaurant reviews:----------", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant reviews:", error.response?.data || error.message);
    throw error;
  }
};

export const replyToProductReview = async (feedbackId, reply) => {
  try {
    const response = await apiClient.post(
      `/feedback/product-feedback/${feedbackId}/reply`,
      { reply }  // Make sure this matches exactly what backend expects
    );
    console.log("Product review reply submitted:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting product review reply:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const getRestaurantProductReviews = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/feedback/product/restaurants/${restaurantId}`);
    console.log("Fetched restaurant product reviews:----------", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant product reviews:", error.response?.data || error.message);
    throw error;
  }
};


// Reply to feedback
export const replyToFeedback = async (restaurantId, feedbackId, reply) => {
  try {
    const response = await apiClient.post(
      `/feedback/restaurants/${restaurantId}/feedback/${feedbackId}/replay`,
      { reply }
    );
    return response.data;
  } catch (error) {
    console.error("Error replying to feedback:", error.response?.data || error.message);
    throw error;
  }
};

export const createOfferByRestaurantOwner = async (restaurantId, offerData) => {
  try {
    const response = await apiClient.post(
      `/merchant/restaurant/${restaurantId}/offer`,
      offerData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating offer:", error.response?.data || error.message);
    throw error;
  }
};

export const updateRestaurantOffer = async (offerId, offerData,restaurantId) => {
  try {
    const response = await apiClient.put(`/merchant/restaurant/${restaurantId}/offe/${offerId}`, offerData);
    return response.data;
  } catch (error) {
    console.error("Error updating offer:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteRestaurantOffer = async (offerId,restaurantId) => {
  try {
    const response = await apiClient.delete(`/merchant/restaurant/${restaurantId}/offe/${offerId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting offer:", error.response?.data || error.message);
    throw error;
  }
};



//get all offers to merchant
export const getAssignableOffers = async () => {
  try {
    const response = await apiClient.get('/merchant/offer/assignableOffers');
    return response.data;
  } catch (error) {
    console.error("Error fetching assignable offers:", error.response?.data || error.message);
    throw error;
  }
};


// Get offers for a specific restaurant
export const getOffersForRestaurant = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/merchant/restaurant/${restaurantId}/offer`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant offers:", error.response?.data || error.message);
    throw error;
  }
};

export const toggleOfferAssignment = async (offerId, restaurantId) => {
  try {
    const response = await apiClient.put(
      `/merchant/restuarants/${restaurantId}/offer/${offerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling offer assignment:", error.response?.data || error.message);
    throw error;
  }
};



// service section for create 
export const addServiceArea = async (restaurantId, serviceAreas) => {
  try {
    const response = await apiClient.post(`/restaurants/${restaurantId}/service-areas`, {
      serviceAreas
    });
    return response.data;
  } catch (error) {
    console.error("Error adding service areas:", error.response?.data || error.message);
    throw error;
  }
};

export const getServiceAreas = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}/service-areas`);
    console.log("Fetched service areas:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching service areas:", error);
    throw error;
  }
};
