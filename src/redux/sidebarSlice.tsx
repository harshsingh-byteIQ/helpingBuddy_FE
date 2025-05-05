import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialStateData } from "../utils/Types";

const initialState: initialStateData = {
    name : "Profile",
    isReload :  false,
};

const sideBarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        manageChange: (state , action: PayloadAction<initialStateData>) => {
            return action.payload;
        }
    }
});

export const { manageChange } = sideBarSlice.actions;

export default sideBarSlice.reducer;
