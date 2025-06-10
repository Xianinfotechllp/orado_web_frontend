import React, { useEffect, useState } from "react";
import Menucard from "./Menucard";
import { addToCart, getCart } from "../../apis/cartApi";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../slices/cartSlice";

function CategorySection({ category, restaurantId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cartFromRedux = useSelector((state) => state.cart.items); // Get cart items from Redux

  const [cartItems, setCartItems] = useState({});

  // Sync local cartItems state with Redux cart items on load or redux update
  useEffect(() => {
    // Convert array of items to map { productId: quantity }
    const cartMap = {};
    if (cartFromRedux && cartFromRedux.length > 0) {
      console.log("Cart items from Redux:", cartFromRedux);
      
      cartFromRedux.forEach(item => {
        cartMap[item.productId._id] = item.quantity;
      });
    }
    setCartItems(cartMap);
  }, [cartFromRedux]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchCart = async () => {
      try {
        const res = await getCart();
        console.log("getCart response:", res);

        if (res?._id) {
          dispatch(setCart(res));  // Set full cart object (including products) in Redux
        }
      } catch (error) {
        console.error("Failed to fetch cart", error);
      }
    };

    fetchCart();
  }, [user, dispatch]);

  const handleAddCart = async (item, quantity) => {
    try {
      const userId = user._id;

      // Update local UI state immediately
      setCartItems((prev) => ({
        ...prev,
        [item._id]: quantity,
      }));

      await addToCart(restaurantId, userId, item._id, quantity);

      // Optionally, you can refetch cart or update Redux if addToCart returns updated cart
      // Or dispatch Redux update here if you have action to add/update item in Redux

    } catch (error) {
      console.error("Failed to update cart", error);
    }
  };

  return (
    <div className="my-8 w-full flex flex-col px-4 sm:px-6 md:px-10 lg:px-20">
      <h2 className="text-2xl font-bold mb-2 text-left">{category.categoryName}</h2>
      <p className="text-gray-600 mb-4 text-left">{category.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.items.length > 0 ? (
          category.items.map((item) => (
            <Menucard
              key={item._id}
              item={item}
              onQuantityChange={handleAddCart}
              quantity={cartItems[item._id] || 0}  // Use synced local state
            />
          ))
        ) : (
          <p className="text-gray-500">No items available in this category yet.</p>
        )}
      </div>
    </div>
  );
}

export default CategorySection;
