import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch cart from backend
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId) => {
    const response = await axios.get(`http://localhost:5000/cart/${userId}`);
    return response.data; // your backend cart JSON
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],      // items: [{ product: {...}, quantity: number }]
    status: 'idle',
    error: null,
  },
  reducers: {
    addOrUpdateItem: (state, action) => {
      const { product, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product._id === product._id
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity = quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    updateQuantity: (state, action) => {
      const { productId, change } = action.payload;
      const item = state.items.find((i) => i.product._id === productId);
      if (item) {
        item.quantity = Math.max(0, item.quantity + change);
        // Remove if quantity zero
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.product._id !== productId);
        }
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.product._id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const products = action.payload.products || [];
        state.items = products.map((p) => ({
          product: {
            _id: p.productId,
            name: p.name,
            price: p.price,
            // add more fields if needed
          },
          quantity: p.quantity,
        }));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addOrUpdateItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
