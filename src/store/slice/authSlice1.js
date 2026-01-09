import { app_settings, fetchCheckUser, fetchForgetPassword, fetchLogutService, fetchResetPassword, fetchVerifyOtpService, loginApi } from "@/services";
import localStore from "@/utils/localStore";
import { logout_user } from "@/utils/loginUserData";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAppSettings = createAsyncThunk('auth/appSetting', async(_, { rejectWithValue}) => {
    try {
        const responseApi = await app_settings();
        // console.log('responseApi', responseApi?.data)
        return responseApi?.data;
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const checkExistUser = createAsyncThunk('auth/checkUser', async({...payload}, {rejectWithValue}) => {
    try {
        const responseApi = await fetchCheckUser({...payload});
        console.log('responseApi', responseApi)
        return responseApi?.data;
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async(payload , {rejectWithValue}) => {
    try {
        const responseApi = await fetchVerifyOtpService(payload);
        console.log('responseApi', responseApi);
        return responseApi?.data;
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const logoutUser = createAsyncThunk('auth/logout', async(_, {rejectWithValue}) => {
    try {
        const responseAPi = await fetchLogutService();
        // console.log('responseApi', responseAPi)
        return responseAPi?.data;
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const forgetPassword = createAsyncThunk('auth/forgot-password', async(payload, { rejectWithValue }) => {
    try {
        const response_api = await fetchForgetPassword(payload)
        // console.log('response_api', response_api?.data)
        return response_api?.data;
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const resetPassword = createAsyncThunk('auth/reset-password', async(payload, { rejectWithValue }) => {
    try {
        const response_api = await fetchResetPassword(payload)
        console.log('response_api', response_api?.data)
        return response_api?.data
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const loginUser = createAsyncThunk('auth/loginUser', async (formData, { rejectWithValue }) => {
    try{
        const res = await loginApi(formData);
        const payload = res.data;
        // save tokens if present
        if (payload?.data) {
            const token = payload?.data?.accessToken;
            const refresh = payload?.data?.refreshToken;
            const cred = payload?.data;
            if (token) localStore.setToken(token);
            if (refresh) localStore.setRefreshToken(refresh);
            if (cred) localStore.setCred(cred);
        }
        return payload;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Login Failed");
    }
});


export const authSlice = createSlice({
    name: 'auth',
    initialState : {
        appSettingsData: null,
        appsettingError: null,
        appsettingloading: null,
        exitUser: null,
        existUserLoading: null,
        existUserError: null,
        verifyOtpLoading: null,
        verifyOtpError: null,
        verifyOtpData: null,
        userProfileData: null,
        forgetPasswordData: null,
        forgetPasswordLoading: false,
        forgetPasswordError: false,
        resetPasswordData: null,
        resetPasswordLoading: false,
        resetPasswordError: false,
        data: null,
        loginLoading: false,
        error: null,
    },
    reducers: {
        resetExistData: (state, action) => {
            state.exitUser = null;
        },
        resetVerifyOtpData: (state) => {
            state.verifyOtpData = null;
        },
        resetForgetPasswordData: (state) => {
            state.forgetPasswordData = null;
            state.forgetPasswordLoading = false;
            state.forgetPasswordError = false;
        },
        resetPasswordState: (state) => {
            state.resetPasswordData = null;
            state.resetPasswordLoading = false;
            state.resetPasswordError = false;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAppSettings.pending, (state) => {
                state.appsettingloading = true;
                state.appsettingError = false;
            })
            .addCase(fetchAppSettings.fulfilled, (state, action) => {
                state.appsettingloading = false;
                state.appSettingsData = action.payload;
            })
            .addCase(fetchAppSettings.rejected, (state) => {
                state.appsettingloading = false;
                state.appsettingError = true;
            })

            .addCase(checkExistUser.pending, (state) => {
                state.existUserLoading = true;
                state.existUserError = false;
            })
            .addCase(checkExistUser.fulfilled, (state, action) => {
                state.exitUser = action.payload;
                state.existUserLoading = false;
                state.existUserError = false;
            })
            .addCase(checkExistUser.rejected, (state) => {
                state.existUserLoading = false;
                state.existUserError = true;
            })

            .addCase(verifyOtp.pending, (state) => {
                state.verifyOtpLoading = true;
                state.verifyOtpError = false;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.verifyOtpData = action.payload;
                state.verifyOtpLoading = false;
                state.verifyOtpLoading = false;
            })
            .addCase(verifyOtp.rejected, (state) => {
                state.verifyOtpError = true;
                state.verifyOtpLoading = false;
            })

            .addCase(logoutUser.pending, (state) => {
                state.existUserLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.userProfileData = null;
                logout_user();
            })
            .addCase(logoutUser.rejected, (state) => {
                // state.userProfileData = null;
                // logout_user();
            })

            .addCase(forgetPassword.pending, (state) => {
                state.forgetPasswordData = null;
                state.forgetPasswordLoading = true;
                state.forgetPasswordError = false;
            })
            .addCase(forgetPassword.fulfilled, (state, action) => {
                state.forgetPasswordData = action.payload;
                state.forgetPasswordLoading = false;
                state.forgetPasswordError = false;
            })
            .addCase(forgetPassword.rejected, (state) => {
                state.forgetPasswordData = null;
                state.forgetPasswordLoading = false;
                state.forgetPasswordError = true;
            })

            .addCase(resetPassword.pending, (state) => {
                state.resetPasswordData = null;
                state.resetPasswordLoading = true;
                state.resetPasswordError = false;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.resetPasswordData = action.payload;
                state.resetPasswordLoading = false;
                state.resetPasswordError = false;
            })
            .addCase(resetPassword.rejected, (state) => {
                state.resetPasswordData = null;
                state.resetPasswordLoading = false;
                state.resetPasswordError = true;
            })

            .addCase(loginUser.pending, (state) => {
                state.loginLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loginLoading = false;
                state.data = action.payload?.data || null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginLoading = false;
                state.error = action.payload;
            })
    }
})

export const {resetExistData, resetVerifyOtpData, resetForgetPasswordData, resetPasswordState} = authSlice.actions;
export default authSlice.reducer;