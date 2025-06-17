import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartId: null,
    products: [],
    restaurantId: null,
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setCartId: (state, action) => {
      state.cartId = action.payload;
    },

  setCart: (state, action) => {
  state.cartId = action.payload?._id || null;
  state.products = action.payload?.products || [];
  state.restaurantId = action.payload?.restaurantId || null;

  // recalculate total price — support both {product, quantity} and {productId, price, quantity}
  state.totalPrice = state.products.reduce((total, item) => {
    const price = item?.price ?? item?.product?.price ?? 0;
    const quantity = item?.quantity ?? 0;
    return total + price * quantity;
  }, 0);
},


    addItem: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.products.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        existingItem.quantity = quantity; // set to new value
      } else {
        state.products.push({ product, quantity });
      }

    
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.products.find((item) => item.product._id === productId);

      if (item) {
        const priceChange = (quantity - item.quantity) * item.product.price;
        item.quantity = quantity;
        state.totalPrice += priceChange;
      }
    },

    removeItem: (state, action) => {
      const productId = action.payload;
      const removedItem = state.products.find(
        (item) => item.product._id === productId
      );

      if (removedItem) {
        state.totalPrice -= removedItem.product.price * removedItem.quantity;
        state.products = state.products.filter(
          (item) => item.product._id !== productId
        );
      }
    },

    clearCart: (state) => {
      state.cartId = null;
      state.products = [];
      state.restaurantId = null;
      state.totalPrice = 0;
    },
  },
});

// Export actions
export const {
  setCartId,
  setCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCart = (state) => state.cart;

export const selectCartItems = (state) => state.cart?.products || [];

export const selectCartId = (state) => state.cart?.cartId;

export const selectCartItemCount = (state) =>
  (state.cart?.products || []).reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;
