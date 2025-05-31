import { configureStore, combineReducers } from "@reduxjs/toolkit";
import locationReducer from "../slices/locationSlice";
import authReducer from "../slices/authSlice";
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

// Combine your reducers
const rootReducer = combineReducers({
  location: locationReducer,
  auth: authReducer,
});

// Setup persist config
const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["auth", "location"], // now both are persisted
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export store and persistor
export const persistor = persistStore(store);
export default store;
