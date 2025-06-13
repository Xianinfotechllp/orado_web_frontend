import { configureStore, combineReducers } from "@reduxjs/toolkit";
import locationReducer from "../slices/locationSlice";
import authReducer from "../slices/authSlice";
import addressReducer from "../slices/addressSlice";
import cartReducer from "../slices/cartSlice";  // ✅ import cartSlice

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storageSession from "redux-persist/lib/storage/session";

// ✅ Combine all reducers including cart
const rootReducer = combineReducers({
  location: locationReducer,
  auth: authReducer,
  address: addressReducer,
  cart: cartReducer,   // ✅ add cart reducer
});

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["auth", "location", "address", "cart"],
  migrate: (state) => {
    if (state.cart?._persistCleared) {
      return Promise.resolve({
        ...state,
        cart: {
          cartId: null,
          items: [],
          _persistCleared: false // Reset the flag
        }
      });
    }
    return Promise.resolve(state);
  }
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with middleware adjustment for redux-persist
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
