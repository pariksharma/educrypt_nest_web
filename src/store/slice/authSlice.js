import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi, signupApi, forgotPasswordApi, checkUserApi, verifyOtpApi, signupFormApi, changeDetectorApi, countriesApi, statesApi, citiesApi, resetPasswordApi, fetchForgetPassword, appSettingApi } from "@/services";
import localStore from "@/utils/localStore";


// Login

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


// Check user

export const checkuser = createAsyncThunk("auth/checkuser", async ({ ...payload }, { rejectWithValue }) => {
    // console.log('payload', payload)
  try {
    const res = await checkUserApi({ ...payload });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
  }
});


// VERIFY OTP

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ ...payload }, { rejectWithValue }) => {
  try {
    const res = await verifyOtpApi({ ...payload });
    const payloadRes = res.data;
    if (payloadRes?.data) {
      const token = payloadRes?.data?.accessToken;
      const refresh = payloadRes?.data?.refreshToken;
      const cred = payloadRes?.data;
      if (token) localStore.setToken(token);
      if (refresh) localStore.setRefreshToken(refresh);
      if (cred) localStore.setCred(cred);
    }
    return payloadRes;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "OTP verification failed");
  }
});

//sign up form

export const getSignupForm = createAsyncThunk('auth/signupForm', async(_, {rejectWithValue}) => {
    try{
        const res = await signupFormApi();
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to get Signup Form");
    }
});

// sign up

export const signupUser = createAsyncThunk('auth/signupUser', async({...payload}, {rejectWithValue}) => {
    try{
        const res = await signupApi({...payload});
        const payloadRes = res.data;
        if (payloadRes?.data) {
        const token = payloadRes?.data?.accessToken;
        const cred = payloadRes?.data;
        if (token) localStore.setToken(token);
        if (cred) localStore.setCred(cred);
        }
        return payloadRes;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'failed to sign up');
    }
})


// Countries

export const fetchCountries = createAsyncThunk(
  "auth/fetchCountries",
  async(_, {rejectWithValue}) => {
    try {
      const res = await countriesApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch countries");
    }
  }
);

// state Api

export const fetchStates = createAsyncThunk(
  "auth/fetchStates",
  async ({ country_id }, { rejectWithValue }) => {
    try {
      const res = await statesApi({ country_id });
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch states");
    }
  }
);


// city api

export const fetchCities = createAsyncThunk(
  "auth/fetchCities",
  async ({ state_id }, { rejectWithValue }) => {
    try {
      const res = await citiesApi({ state_id });
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cities");
    }
  }
);

// App Setting

export const fetchAppSettings = createAsyncThunk("auth/appSetting", async(_, { rejectWithValue }) => {
    try {
        const res = await appSettingApi();
        console.log('res', res)
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch app setting");
    }
})


// reset password

export const resetForgetPasswordData = createAsyncThunk('auth/resetPassword', async(payload, {rejectWithValue}) => {
    try{
        const res = await resetPasswordApi(payload);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "failed to reset password");
    }
})

// logout Api

export const logoutUser = createAsyncThunk('auth/logoutUser', async(_, {rejectWithValue}) => {
    try{
        const res = await logoutApi();
        localStore.clearAllAuth();
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Logout failed (client)");
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

const authSlice = createSlice({
    name : 'auth',
    initialState: {
        data: null,
        appSettings: null,
        signupForms: null,
        signupUsers: null,
        userCheck: null,
        countries: null,
        newPassword: null,
        states: [],
        cities: [],
        loginLoading: false,
        dataLoading: false,
        appsettingLoading: false,
        signupformLoading: false,
        signupuserLoading: false,
        passwordLoading: false,
        usercheckLoading: false,
        otpVerifyLoading: false,
        error: null,
        success: null,
        appsettingloading: false,
        verifyOtpData: null,
        resetPasswordData: null,
        resetPasswordLoading: false,
        resetPasswordError: false,
        forgetPasswordData: null,
        forgetPasswordLoading: false,
        forgetPasswordError: false,
    },
    reducers: {
        logout: (state) => {
            state.data = null;
            state.profile = null;
            localStore.clearAllAuth();
        },
        clearError(state) {
            state.error = null;
        },
        resetCities(state){
            state.cities = [];
        },
        resetState(state){
            state.states = [];
        },
        resetVerifyOtpData: (state) => {
            state.verifyOtpData = null;
        },
        resetPasswordState: (state) => {
            state.resetPasswordData = null;
            state.resetPasswordLoading = false;
            state.resetPasswordError = false;
        },

        resetForgetPasswordState: (state) => {
            state.forgetPasswordData = null;
            state.forgetPasswordLoading = false;
            state.forgetPasswordError = false;
        },
    },
    extraReducers: (builder) => {
        builder
            //Login
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

            // check user

            .addCase(checkuser.pending, (state) => { 
                state.usercheckLoading = true; 
            })
            .addCase(checkuser.fulfilled, (state, action) => { 
                state.usercheckLoading = false;
                state.userCheck = action.payload?.data || action.payload;
            })
            .addCase(checkuser.rejected, (state, action) => {
                state.usercheckLoading = false;
                state.error = action.payload;
            })

            // verify otp 

            .addCase(verifyOtp.pending, (state) => {
                state.otpVerifyLoading = true;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.otpVerifyLoading = false;
                state.data = action.payload?.data || null;
                state.verifyOtpData = action?.payload;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.otpVerifyLoading = false;
                state.error = action.payload;
            })

            // signup form

            .addCase(getSignupForm.pending, (state) => {
                state.signupformLoading = true;
            })
            .addCase(getSignupForm.fulfilled, (state, action) => {
                state.signupformLoading = false;
                state.signupForms = action.payload;
            })
            .addCase(getSignupForm.rejected, (state, action) => {
                state.signupformLoading = false;
                state.signupForms = action.error;
            })

            //signup user

            .addCase(signupUser.pending, (state) => {
                state.signupuserLoading = true;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.signupuserLoading = false;
                state.signupUsers = action.payload;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.signupuserLoading = false;
                state.signupUsers = action.error;
            })

            // Countries
            .addCase(fetchCountries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = action.payload;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // States
            .addCase(fetchStates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStates.fulfilled, (state, action) => {
                state.loading = false;
                state.states = action.payload;
            })
            .addCase(fetchStates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Cities
            .addCase(fetchCities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.loading = false;
                state.cities = action.payload;
            })
            .addCase(fetchCities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // App Setting
            .addCase(fetchAppSettings.pending, (state, action) => {
                // state.appSettings = null;
                state.appsettingloading = true;
            })
            .addCase(fetchAppSettings.fulfilled, (state, action) => {
                state.appSettings = action.payload;
                state.appsettingloading = false
            })

            // reset password
            .addCase(resetForgetPasswordData.pending, (state) => {
                state.passwordLoading = true;
                state.resetPasswordData = null;
                state.resetPasswordLoading = true;
            })
            .addCase(resetForgetPasswordData.fulfilled, (state, action) => {
                state.passwordLoading = false;
                state.newPassword = action.payload;
                state.resetPasswordData = action?.payload;
                state.resetPasswordLoading = false
            })
            .addCase(resetForgetPasswordData.rejected, (state, action) => {
                state.passwordLoading = false;
                state.newPassword = action.payload;
                state.resetPasswordData = null;
                state.resetPasswordLoading = false;
            })


            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = null;
                state.profile = null;
                localStore.clearAllAuth();
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                localStore.clearAllAuth();
                state.data = null;
                state.profile = null;
                state.error = action.payload?.message || action.error?.message || "Logout failed";
            })
    }
})

export const { logout, clearError, resetCities, resetState, resetVerifyOtpData, resetPasswordState, resetForgetPasswordState } = authSlice.actions;
export default authSlice.reducer;