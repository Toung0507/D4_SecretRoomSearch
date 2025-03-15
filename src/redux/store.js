import { configureStore } from "@reduxjs/toolkit";
import userInfoSliceReducer from "./slices/userInfoSlice";
import toastReducer from "./slices/toastSlice";

const store = configureStore({
    reducer: {
        toast: toastReducer,
        userInfo: userInfoSliceReducer,
    }
});

export default store;