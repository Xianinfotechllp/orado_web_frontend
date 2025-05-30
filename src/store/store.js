import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from 'redux';
import locationReducer from "../slices/locationSlice";

const store = configureStore({
  reducer: {
    location: locationReducer,
  },
});

export default store;
