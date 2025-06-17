import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/userProfile/layout/AppLayout';
import Sidebar from '../../components/userProfile/navigation/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { Menu } from 'lucide-react';
import FavoriteRestaurants from '../../components/userProfile/favourites/FavouriteRestruants';

import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import apiClient from '../../apis/apiClient/apiClient';

const FavouriteRestaurantsPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchFavoriteRestaurants = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get('/user/fav/restaurants');
        setFavoriteRestaurants(response.data.data || []);
      } catch (err) {
        console.error('Error fetching favorite restaurants:', err);
        setError('Failed to load favorite restaurants');
        toast.error('Failed to load favorite restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteRestaurants();
  }, [user]);

  const handleRemoveFavorite = async (restaurantId) => {
    try {
      console.log(restaurantId,"form compone")
     await apiClient.put('/user/fav/restaurants/remove', { restaurantId:restaurantId })
      setFavoriteRestaurants(prev => 
        prev.filter(restaurant => restaurant._id !== restaurantId)
      );
      toast.success('Removed from favorites');
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove from favorites');
    }
  };

  return (
    <>
      <Navbar />
      <AppLayout>
        <div className="flex flex-col md:flex-row">
          {/* Mobile menu button */}
          <div className="md:hidden flex justify-between items-center p-4 bg-white border-b">
            <h2 className="text-xl font-semibold">Favourites</h2>
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar */}
          <div
            className={`${
              showSidebar ? 'block' : 'hidden'
            } md:block w-full md:w-64 border-r bg-white`}
          >
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 md:p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : favoriteRestaurants.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No favorite restaurants yet</h3>
                <p className="text-gray-500 mt-2">
                  {user ? 'Start adding restaurants to your favorites!' : 'Please login to view favorites'}
                </p>
              </div>
            ) : (
              <FavoriteRestaurants 
                restaurants={favoriteRestaurants} 
                onRemoveFavorite={handleRemoveFavorite}
              />
            )}
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default FavouriteRestaurantsPage;