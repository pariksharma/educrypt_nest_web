import { fetchCurrentAffairDetailService, fetchCurrentAffairListService, fetchCurrentAffairService } from "@/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCurrentAffairs = createAsyncThunk('currentAffair/category', async(_, { rejectWithValue }) => {
    try {
        const response_api = await fetchCurrentAffairService()
        // console.log('response_api', response_api?.data)
        return response_api?.data
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const fetchCurrentAffairList = createAsyncThunk('currentAffair/current-affairs-list', async(payload, { rejectWithValue }) => {
    try {
        const response_api = await fetchCurrentAffairListService(payload);
        // console.log('response_api', response_api?.data);
        return response_api?.data
    } catch (err) {
        return rejectWithValue(err);
    }
})

export const fetchCurrentAffairDetail = createAsyncThunk('currentAffair/current-affair-detail', async(payload, { rejectWithValue }) => {
    try {
        const response_api = await fetchCurrentAffairDetailService(payload)
        // console.log('response_api', response_api)
        return response_api?.data
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const currentAffairSlice = createSlice({
    name: 'currentAffair',
    initialState: {
        categoryData: null,
        categoryLoading: true,
        categoryError: false,
        currentAffairList: null,
        currentAffairListLoading: true,
        currentAffairListError: false,
        currentAffairDetail: null,
        currentAffairLoading: true,
        currentAffairError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentAffairs.pending, (state) => {
                state.categoryData = null;
                state.categoryLoading = true;
                state.categoryError = false;
            })
            .addCase(fetchCurrentAffairs.fulfilled, (state, action) => {
                state.categoryData = action.payload;
                state.categoryLoading = false;
                state.categoryError = false;
            })
            .addCase(fetchCurrentAffairs.rejected, (state) => {
                state.categoryData = null;
                state.categoryLoading = false;
                state.categoryError = true;
            })

            .addCase(fetchCurrentAffairList.pending, (state) => {
                state.currentAffairList = null;
                state.currentAffairListLoading = true;
                state.currentAffairListError = false;
            })
            .addCase(fetchCurrentAffairList.fulfilled, (state, action) => {
                state.currentAffairList = action.payload;
                state.currentAffairListLoading = false;
                state.currentAffairListError = false;
            })
            .addCase(fetchCurrentAffairList.rejected, (state) => {
                state.currentAffairList = null;
                state.currentAffairListLoading = false;
                state.currentAffairListError = true;
            })

            .addCase(fetchCurrentAffairDetail.pending, (state) => {
                state.currentAffairDetail = null;
                state.currentAffairLoading = true;
                state.currentAffairError = false;
            })
            .addCase(fetchCurrentAffairDetail.fulfilled, (state, action) => {
                state.currentAffairDetail = action.payload;
                state.currentAffairLoading = false;
                state.currentAffairError = false;
            })
            .addCase(fetchCurrentAffairDetail.rejected, (state) => {
                state.currentAffairDetail = null;
                state.currentAffairLoading = false;
                state.currentAffairError = true;
            })
    }
})

export default currentAffairSlice.reducer;