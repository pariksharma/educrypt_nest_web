import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import homeReducer from "./slice/homeSlice";
import courseReducer from "./slice/courseSlice";
import userReducer from "./slice/userSlice";
import currentAffairReducer from "./slice/currentAffairSlice";
import paymentReducer from "./slice/paymentSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        home: homeReducer,
        courses: courseReducer,
        user: userReducer,
        currentAffair: currentAffairReducer,
        payment: paymentReducer,
    },
})