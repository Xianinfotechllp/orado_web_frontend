import React, { useEffect, useState } from "react";
import Menucard from "./Menucard";
import { updateCart } from "../../apis/cartApi";
import { useDispatch } from "react-redux";
import { addOrUpdateItem } from "../../slices/cartSlice";
import axios from "axios";


function CategorySection({ category, restaurantId }) {
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState({}); // 👈 to store productId: quantity

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/cart/682c328ea74e4ba29abbfb9f`);
        const cartData = res.data.products;

        // Build a map { productId: quantity }
        const cartMap = {};
        cartData.forEach((item) => {
          cartMap[item.productId] = item.quantity;
        });

        setCartItems(cartMap);
      } catch (error) {
        console.error("Failed to fetch cart", error);
      }
    };

    fetchCart();
  }, []);

  const handleAddCart = async (item, quantity) => {
    try {
      const userId = "6836c9a9451788eb5e4e9e0f";
 setCartItems((prev) => ({
        ...prev,
        [item._id]: quantity,
      }));
      // Call backend API to update cart
      await updateCart("6836c9a9451788eb5e4e9e0f","682c328ea74e4ba29abbfb9f", item._id, quantity);

      // Update local cartItems state
     

      // Update Redux cart state
      dispatch(addOrUpdateItem({ product: item, quantity }));
    } catch (error) {
      console.error("Failed to update cart", error);
    }
  };

  return (
    <div className="my-8 w-full flex flex-col px-auto md:px-10 lg:px-20">
      <h2 className="text-2xl font-bold mb-2 text-left">{category.categoryName}</h2>
      <p className="text-gray-600 mb-4 text-left">{category.description}</p>

      <div className="flex flex-wrap gap-4 w-full">
        {category.items.length > 0 ? (
          category.items.map((item) => (
            <Menucard
              key={item._id}
              item={item}
              onQuantityChange={handleAddCart}
              quantity={cartItems[item._id] || 0}
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
