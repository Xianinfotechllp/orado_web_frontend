
import React, { useState, useEffect } from 'react';
import RestaurantRegistration from './RestaurantRegistration';
import RestaurantEdit from './RestaurantEdit';
import { toast } from 'react-hot-toast';
import RestaurantList from './RestaurantList';
import { useSelector } from 'react-redux';
import { getMerchantRestaurants, toggleRestaurantActiveStatus } from '../../../../apis/restaurantApi';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Lottie from "lottie-react";
import loadingAnimation from "../../../../assets/animations/SpoonLoader.json";
const RestaurantManagement = () => {
  const user = useSelector((state) => state.auth.user);
  const [view, setView] = useState('list'); 
   const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);


    useEffect(() => {
    const fetchRestaurants = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await getMerchantRestaurants(user.id);
        setRestaurants(response.data.restaurants);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load restaurants');
      } finally {
        setLoading(false); 
      }
    };

    fetchRestaurants();
  }, [user]);

  
  const handleRegisterClick = () => {
    setView('registration');
  };

  const handleAddNewClick = () => {
    setView('registration');
  };

  const handleBackToList = () => {
    setView('list');
    setEditingRestaurant(null);
  };

  const handleRegistrationComplete = (formData) => {
    console.log('Registration completed with data:', formData);
   
    const newRestaurant = {
      id: restaurants.length + 1,
      name: formData.restaurantName,
      cuisine: formData.cuisine,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      status: 'pending',
      image: "/placeholder-restaurant.jpg",
      rating: 0,
      orders: 0
    };

    setRestaurants(prev => [...prev, newRestaurant]);
    setView('list');
    
    toast({
      title: "Registration Successful!",
      description: "Your restaurant has been registered successfully. It will be reviewed and activated soon.",
      duration: 5000,
    });
  };
  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant);
    setView('edit');
  };

  const handleUpdateComplete = (updatedRestaurant) => {
    setRestaurants(prev => 
      prev.map(r => r.id === updatedRestaurant.id ? updatedRestaurant : r)
    );
    setView('list');
    toast.success('Restaurant updated successfully');


  };

  const handleRestaurantClick = (restaurant) => {
    console.log('Restaurant clicked:', restaurant);
    // Handle restaurant click - could navigate to restaurant details/settings
  };

 const handleToggleActive = async (restaurantId, isActive) => {
  try {
    // Optimistic UI update - update state immediately
    setRestaurants(prev => 
      prev.map(r => r.id === restaurantId ? { ...r, isActive } : r)
    );

    // API call to update backend
    const response = await toggleRestaurantActiveStatus(restaurantId);
    console.log(response)
    // Verify the response matches our expectation
      if (response?.activeStatus !== isActive) {
        // If not, revert the optimistic update
        setRestaurants(prev => 
          prev.map(r => r.id === restaurantId ? { ...r, isActive: !isActive } : r)
        );
      
      }

    // Optional: show success notification
    toast.success(`Restaurant status updated to ${isActive ? 'active' : 'inactive'}`);
    
    return response;
  } catch (error) {
    console.error('Failed to toggle restaurant status:', error);
    
    // Show error notification to user
    toast.error(`Failed to update status: ${error.message}`);
    
    // Re-throw the error if you need to handle it further up the chain
    throw error;
  }
};


  if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Lottie
        animationData={loadingAnimation}
        loop
        autoplay
      style={{ width: 200, height: 200}}
      />
    </div>
  );
}

    









  if (view === 'registration') {
    return (
      <div className='mr-22'>

     
      <RestaurantRegistration
        onBack={handleBackToList}
        onComplete={handleRegistrationComplete}
      />
       </div>
    );
  }

   if (view === 'edit' && editingRestaurant) {
    return (
      <div className='mr-22'>
        <RestaurantEdit
          restaurantId={editingRestaurant.id}
          onBack={handleBackToList}
          onComplete={handleUpdateComplete}
        />
      </div>
    );
  }

  return (
    <RestaurantList
      restaurants={restaurants}
      onRegisterClick={handleRegisterClick}
      onAddNewClick={handleAddNewClick}
      onRestaurantClick={handleRestaurantClick}
      onEditRestaurant={handleEditRestaurant}
      onToggleActive={handleToggleActive}
    />
  );
};

export default RestaurantManagement;
