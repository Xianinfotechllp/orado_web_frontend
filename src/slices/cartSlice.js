import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartId: null,
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    setCartId: (state, action) => {
      state.cartId = action.payload; // ONLY cartId here!
    },

    setCart: (state, action) => {
      state.cartId = action.payload._id;
      state.items = action.payload.products || [];
    },

    addItem: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product._id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.product._id !== action.payload);
    },

    clearCart: (state) => {
      state.cartId = null;
      state.items = [];
      state._persistCleared = true;
    },
  },

});

// Export actions and reducer
export const { setCartId, setCart, addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export const selectCartId = (state) => state.cart.cartId;
export const selectCartItems = (state) => state.cart.items;
export const selectCart = (state) => state.cart;
export default cartSlice.reducer;
