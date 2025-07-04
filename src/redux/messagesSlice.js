// redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    age: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.age = action.payload.age;
    },
    clearUser: (state) => {
      state.name = '';
      state.age = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
