import { fetchHomeService, fetchGlobalSearchService } from "@/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchHome = createAsyncThunk('home/content', async(_, {rejectWithValue}) => {
    try {
        const responseApi = await fetchHomeService();
        // console.log('responseApi', responseApi?.data)
        return responseApi?.data;
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const fetchGlobalSearch = createAsyncThunk('home/search', async(payload, {rejectWithValue}) => {
    try {
        const responseApi = await fetchGlobalSearchService(payload);
        // console.log('responseApi', responseApi?.data)
        return responseApi?.data;
    } catch (err) {
        return rejectWithValue(err)
    }
})


export const homeSlice = createSlice({
    name: 'home',
    initialState: {
        homeData: null,
        homeloading: false,
        homeError: false,
        headerSearchData: null,
        headerSearchLoading: false,
        homeSearchError: null,
    },
    reducers: {
        clearHeadSearchResult(state) {
            state.headerSearchData = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchHome.pending, (state) => {
            state.homeloading = true;
            state.homeError = false;
        })
        .addCase(fetchHome.fulfilled, (state, action) => {
            state.homeData = action.payload;
            state.homeError = false;
            state.homeloading = false
        })
        .addCase(fetchHome.rejected, (state) => {
            state.homeError = true
            state.homeloading = false
        })

        // search add case 
        .addCase(fetchGlobalSearch.pending, (state) => {
            state.headerSearchLoading = true;
            state.homeSearchError = null;
        })
        .addCase(fetchGlobalSearch.fulfilled, (state, action) => {
            state.headerSearchData = action.payload;
            state.homeSearchError = null;
            state.headerSearchLoading = false;
        })
        .addCase(fetchGlobalSearch.rejected, (state, action) => {
            state.homeSearchError = action.payload;
            state.headerSearchLoading = false;
        })
    }
})

export const {clearHeadSearchResult} = homeSlice.actions;

export default homeSlice.reducer