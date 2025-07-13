import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDark: true,
  isThemeLoaded: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.isDark = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem('theme', state.isDark);
    },
    setThemeLoaded: (state, action) => {
      state.isThemeLoaded = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setThemeLoaded } = themeSlice.actions;
export default themeSlice.reducer;
