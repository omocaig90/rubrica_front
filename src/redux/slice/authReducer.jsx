import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: false,
  reducers: {
    setTrue: () => true,
    setFalse: () => false,
  },
});

export const { setTrue, setFalse } = authSlice.actions;

export default authSlice.reducer;
