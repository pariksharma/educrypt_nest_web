import { fetchMyProfileService, fetchUpdateProfileService } from "@/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getMyProfile = createAsyncThunk("user/getMyProfile", async(_, { rejectWithValue }) => {
    try {
        const response_api = await fetchMyProfileService();
        // console.log('my-profile', response_api);
        return response_api?.data
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const updateProfile = createAsyncThunk('user/updateProfile', async(payload, { rejectWithValue }) => {
    try {
        const response_api = await fetchUpdateProfileService(payload);
        console.log('response_api', response_api?.data)
        return response_api?.data
    } catch (err) {
        return rejectWithValue(err)
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        userLoading: true,
        userError: null,
        updateProfileData: null,
        updateProfileLoading: false,
        updateProfileError: false
    },
    reducers: {
        resetUpdateProfileData: (state, action) => {
            // state.updateProfileData = null;
            state.userData = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyProfile.pending, (state) => {
                state.userData = null;
                state.userLoading = true;
                state.userError = null;
            })
            .addCase(getMyProfile.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.userError = null;
                state.userLoading = null;
            })
            .addCase(getMyProfile.rejected, (state) => {
                state.userData = null;
                state.error = true;
                state.userLoading = null;
            })

            .addCase(updateProfile.pending, (state) => {
                state.updateProfileData = null;
                state.updateProfileLoading = true;
                state.updateProfileError = false;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateProfileData = action.payload;
                state.userData = action.payload;
                state.updateProfileLoading = false;
                state.updateProfileError = false;
            })
            .addCase(updateProfile.rejected, (state) => {
                state.updateProfileData = null;
                state.updateProfileLoading = false;
                state.updateProfileError = true;
            })
    }
})

export const {resetUpdateProfileData} = userSlice.actions;
export default userSlice.reducer;