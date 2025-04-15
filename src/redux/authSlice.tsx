import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../utils/Types";

const initialState: AuthState= {
  role: null,
  access_token : null ,
  id : null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action) => {
      console.log("in auth slice")
      state.role = action.payload.role;
      state.access_token = action.payload.access_token
      state.id = action.payload.id
    },
    clearRole: (state) => {
      state.role = null;
    },
  },
});

export const { setRole, clearRole } = authSlice.actions;
export default authSlice.reducer;
