import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateData {
    name : string,
    isReload : boolean,
}

const initialState: initialStateData = {
    name : "Profile",
    isReload :  false,
};

const sideBarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        manageChange: (state, action: PayloadAction<initialStateData>) => {
            return action.payload;
        }
    }
});

export const { manageChange } = sideBarSlice.actions;

export default sideBarSlice.reducer;
