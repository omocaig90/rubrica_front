import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authReducer';

const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });
  
  export default store;
