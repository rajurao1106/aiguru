import { createSlice } from "@reduxjs/toolkit";

const subjectSlice = createSlice({
  name: "subject",
  initialState: {
    selectedSubject: "",
  },
  reducers: {
    setSelectedSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },
  },
});

export const { setSelectedSubject } = subjectSlice.actions;
export default subjectSlice.reducer;
