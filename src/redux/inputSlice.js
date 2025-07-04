// inputSlice.js
import { createSlice } from "@reduxjs/toolkit";

const inputSlice = createSlice({
  name: "input",
  initialState: {
    text: "",
  },
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
  },
});

export const { setText } = inputSlice.actions;
export default inputSlice.reducer;
