import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 isAsideOpen: true, // default open
  isAsideLoaded: false,
};

const asidebarSlice = createSlice({
  name: 'asidebar',
  initialState,
  reducers: {
    setAsidebar: (state, action) => {
      state.isAsideOpen = action.payload;
      localStorage.setItem('asidebar', action.payload);
    },
    toggleAsidebar: (state) => {
      state.isAsideOpen = !state.isAsideOpen;
      localStorage.setItem('asidebar', state.isAsideOpen);
    },
    setAsideLoaded: (state, action) => {
      state.isAsideLoaded = action.payload;
    },
  },
});

export const { setAsidebar, toggleAsidebar, setAsideLoaded } = asidebarSlice.actions;
export default asidebarSlice.reducer;
