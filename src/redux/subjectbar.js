import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 isSubjectbarOpen: false, // default open
  isSubjectbarLoaded: true,
};

const subjectbarSlice = createSlice({
  name: 'subjectbar',
  initialState,
  reducers: {
    setSubjectbar: (state, action) => {
      state.isSubjectbarOpen = action.payload;
      localStorage.setItem('subjectbar', action.payload);
    },
    toggleSubjectbar: (state) => {
      state.isSubjectbarOpen = !state.isSubjectbarOpen;
      localStorage.setItem('subjectbar', state.isSubjectbarOpen);
    },
    isSubjectbarLoaded: (state, action) => {
      state.isSubjectbarLoaded = action.payload;
    },
  },
});

export const { setSubjectbar, toggleSubjectbar, isSubjectbarLoaded } = subjectbarSlice.actions;
export default subjectbarSlice.reducer;
