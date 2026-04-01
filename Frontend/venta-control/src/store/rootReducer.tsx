import { combineReducers } from '@reduxjs/toolkit';
import { AuthSlice } from './Auth/authSlice';
import { uiSlice } from './UI/uiSlices';
import { userSlice } from './User/userSlice';
import { productSlice } from './Product/productSlice';


const rootReducer = combineReducers({
  auth: AuthSlice.reducer,
  ui: uiSlice.reducer,
  user: userSlice.reducer,
  product: productSlice.reducer,
});

export default rootReducer;