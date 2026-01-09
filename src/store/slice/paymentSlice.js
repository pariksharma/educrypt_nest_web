import { fetchCompletePaymentService, fetchCourseCouponService, fetchInitializePaymentService, fetchVerifyCouponService } from "@/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCourseCoupon = createAsyncThunk('payment/course-coupon', async(params, rejectWithValue) => {
    try {
        const response_api = await fetchCourseCouponService(params);
        // console.log('response_api', response_api?.data)
        return response_api?.data
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const fetchInitializePayment = createAsyncThunk('payment/initialize', async(params, rejectWithValue) => {
    try {
        const response_api = await fetchInitializePaymentService(params)
        // console.log('response_api', response_api?.data)
        return response_api?.data
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const fetchCompletePayment = createAsyncThunk('payment/complete', async(params, rejectWithValue) => {
    try {
        const response_api = await fetchCompletePaymentService(params)
        // console.log('response_api', response_api?.data)
        return response_api?.data
    } catch (err) {
        rejectWithValue(err);
    }
})

export const fetchVerifyCoupon = createAsyncThunk('payment/verify-coupon', async(params, rejectWithValue) => {
    try {
        const response_api = await fetchVerifyCouponService(params)
        console.log('response_api', response_api?.data);
        return response_api?.data;
    } catch (err) {
        rejectWithValue(err)
    }
})
 
export const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        couponData: null,
        couponError: false,
        couponLoading: true,
        paymentInitializeData: null,
        paymentInitializeLoading: false,
        paymentInitializeError: false,
        paymentCompleteData: null,
        paymentCompleteLoading: null,
        paymentCompleteError: null,
        verifyCouponData: null,
        verifyCouponLoading: false,
        verifyCouponError: false 
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchCourseCoupon.pending, (state) => {
            state.couponData = null;
            state.couponLoading = true;
            state.couponError = false;
        })
        .addCase(fetchCourseCoupon.fulfilled, (state, action) => {
            state.couponData = action?.payload;
            state.couponLoading = false;
            state.couponError = false;
        })
        .addCase(fetchCourseCoupon.rejected, (state, action) => {
            state.couponData = null;
            state.couponLoading = false;
            state.couponError = true;
        })

        .addCase(fetchInitializePayment.pending, (state) => {
            state.paymentInitializeData = null;
            state.paymentInitializeLoading = true;
            state.paymentInitializeError = false;
        })
        .addCase(fetchInitializePayment.fulfilled, (state, action) => {
            state.paymentInitializeData = action?.payload;
            state.paymentInitializeLoading = false;
            state.paymentInitializeError = false;
        })
        .addCase(fetchInitializePayment.rejected, (state) => {
            state.paymentInitializeData = null;
            state.paymentInitializeLoading = false;
            state.paymentInitializeError = true;
        })

        .addCase(fetchCompletePayment.pending, (state) => {
            state.paymentCompleteData = null;
            state.paymentCompleteLoading = true;
            state.paymentCompleteError = false
        })
        .addCase(fetchCompletePayment.fulfilled, (state, action) => {
            state.paymentCompleteData = action?.payload;
            state.paymentCompleteLoading = false;
            state.paymentCompleteError = false
        })
        .addCase(fetchCompletePayment.rejected, (state) => {
            state.paymentCompleteData = null;
            state.paymentCompleteLoading = false;
            state.paymentCompleteError = true
        })

        .addCase(fetchVerifyCoupon.pending, (state) => {
            state.verifyCouponData = null;
            state.verifyCouponLoading = true;
            state.verifyCouponError = false;
        })
        .addCase(fetchVerifyCoupon.fulfilled, (state, action) => {
            state.verifyCouponData = action?.payload;
            state.verifyCouponLoading = false;
            state.verifyCouponError = false;
        })
        .addCase(fetchVerifyCoupon.rejected, (state) => {
            state.verifyCouponData = null;
            state.verifyCouponLoading = false;
            state.verifyCouponError = true;
        })
    }
})

export default paymentSlice.reducer