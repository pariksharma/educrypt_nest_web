import { fetchAllCoursesService, fetchContentService, fetchCourseDetailService, fetchLiveClassService, fetchMyCourseService, fetchAllReviewService, fetchSaveCourseService, fetchDeleteReviewService } from "@/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAllCourse = createAsyncThunk('course/allCourse', async(payload, {rejectWithValue}) => {
    try {
        const responseApi = await fetchAllCoursesService(payload)
        // console.log('responseApi', responseApi?.data)
        return responseApi?.data;
    } catch (err) {
        rejectWithValue(err);
    }
})

export const fetchAllFreeCourse = createAsyncThunk('course/allFreeCourse', async(payload, {rejectWithValue}) => {
    try {
        const responseApi = await fetchAllCoursesService(payload)
        // console.log('responseApi', responseApi?.data)
        return responseApi?.data;
    } catch (err) {
        rejectWithValue(err);
    }
})

export const fetchCourseDetail = createAsyncThunk('course/getCourseDetail', async(payload, { rejectWithValue }) => {
    try{
        const response_api = await fetchCourseDetailService(payload);
        // console.log('responseApi', response_api?.data);
        return response_api?.data
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const fetchContent = createAsyncThunk('course/content', async(payload, { rejectWithValue }) => {
    try {
        const response_api = await fetchContentService(payload);
        // console.log('response', response_api?.data);
        return response_api?.data;
    } catch (err) {
        return rejectWithValue(err)
    }
})

export const fetchMyCourse = createAsyncThunk('course/mycourses', async(payload, { rejectWithValue }) => {
    try {
        const response_api = await fetchMyCourseService(payload);
        // console.log('response_api', response_api?.data);
        return response_api?.data
    } catch (err) {
        return rejectWithValue(err);
    }
})

export const fetchLiveClass = createAsyncThunk('course/classes', async(payload, { rejectWithValue }) => {
    try {
        const response_api = await fetchLiveClassService(payload)
        console.log('response_api', response_api?.data)
        return response_api?.data;
    } catch (err) {
        return rejectWithValue(err);
    }
})

//Save Review
export const fetchSaveCourseReview = createAsyncThunk(
  'course/saveCourseReview',
  async ({...payload}, { rejectWithValue }) => {
    try {
      const res = await fetchSaveCourseService({...payload});
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save review');
    }
  }
);

export const fetchDeleteMyReview = createAsyncThunk(
  'course/deleteMyReview',
  async ({...payload}, { rejectWithValue }) => {
    try {
      const res = await fetchDeleteReviewService({...payload});
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete review');
    }
  }
);

export const fetchGetAllReview = createAsyncThunk(
  'course/getAllReview',
  async ({...payload}, { rejectWithValue }) => {
    try {
      const res = await fetchAllReviewService({...payload});
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to see all review');
    }
  }
);

export const courseSlice = createSlice({
    name: 'courses',
    initialState: {
        allCourseData: [],
        allCourseLoading: true,
        allCourseError: false,
        freeCourseData: [],
        freeCourseLoading: false,
        freeCourseError: false,
        courseDetailData: null,
        courseDetailError: false,
        courseDetailLoading: true,
        contentData: null,
        contentError: false,
        contentLoading: false,
        myCourseData: null,
        myCourseLoading: false,
        myCourseError: false,
        liveClassData: [],
        liveClassLoading: true,
        liveClassError: false,

        saveReviewData: null,
        allReviewData: null,
        deleteReviewData: null,
        deleteReviewLoading: false,
        allReviewLoading: false,
        saveReviewLoading: false,
        deleteReviewError: null,
        allReviewError: null,
        saveReviewError: null,
    },
    reducers: {
        resetAllCourseData: (state, action) => {
            state.allCourseData = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCourse.pending, (state) => {
                state.allCourseLoading = true;
                state.allCourseData = [];
                state.allCourseError = false;
            })
            .addCase(fetchAllCourse.fulfilled, (state, action) => {
                state.allCourseData = action.payload;
                state.allCourseLoading = false;
                state.allCourseError = false;
            })
            .addCase(fetchAllCourse.rejected, (state) => {
                state.allCourseData = [];
                state.allCourseError = false;
                state.allCourseLoading = false;
            })

            .addCase(fetchAllFreeCourse.pending, (state) => {
                state.freeCourseData = [];
                state.freeCourseLoading = true;
                state.freeCourseError = false;
            })
            .addCase(fetchAllFreeCourse.fulfilled, (state, action) => {
                state.freeCourseData = action.payload;
                state.freeCourseLoading = false;
                state.freeCourseError = false;
            })
            .addCase(fetchAllFreeCourse.rejected, (state) => {
                state.freeCourseData = [];
                state.freeCourseLoading = false;
                state.freeCourseError = true;
            })

            .addCase(fetchCourseDetail.pending, (state) => {
                state.courseDetailData = null;
                state.courseDetailLoading = true;
                state.courseDetailError = false;
            })
            .addCase(fetchCourseDetail.fulfilled, (state, action) => {
                state.courseDetailData = action.payload;
                state.courseDetailError = false;
                state.courseDetailLoading = false;
            })
            .addCase(fetchCourseDetail.rejected, (state) => {
                state.courseDetailData = null;
                state.courseDetailError = true;
                state.courseDetailLoading = false;
            })

            .addCase(fetchContent.pending, (state) => {
                state.contentData = null;
                state.contentError = false;
                state.contentLoading = true;
            })
            .addCase(fetchContent.fulfilled, (state, action) => {
                state.contentData = action.payload;
                state.contentError = false;
                state.contentLoading = false
            })
            .addCase(fetchContent.rejected, (state) => {
                state.contentData = null;
                state.contentError = true;
                state.contentLoading = false;
            })

            .addCase(fetchMyCourse.pending, (state) => {
                state.myCourseData = null;
                state.myCourseLoading = true;
                state.myCourseLoading = false;
            })
            .addCase(fetchMyCourse.fulfilled, (state, action) => {
                state.myCourseData = action.payload;
                state.myCourseLoading = false;
                state.myCourseError = false;
            })
            .addCase(fetchMyCourse.rejected, (state) => {
                state.myCourseData = null;
                state.myCourseLoading = false;
                state.myCourseError = true;
            })

            .addCase(fetchLiveClass.pending, (state) => {
                state.liveClassData = [];
                state.liveClassLoading = true;
                state.liveClassError = false;
            })
            .addCase(fetchLiveClass.fulfilled, (state, action) => {
                state.liveClassData = action.payload;
                state.liveClassLoading = false;
                state.liveClassError = false;
            })
            .addCase(fetchLiveClass.rejected, (state) => {
                state.liveClassData = [];
                state.liveClassLoading = false;
                state.liveClassError = true;
            })


            //save review
            .addCase(fetchSaveCourseReview.pending, (state) => {
              state.saveReviewLoading = true;
            })
            .addCase(fetchSaveCourseReview.fulfilled, (state, action) => {
              state.saveReviewLoading = false;
              state.saveReviewData = action.payload;
            })
            .addCase(fetchSaveCourseReview.rejected, (state, action) => {
              state.saveReviewLoading = false;
              state.saveReviewError = action.payload;
            })

            // delete review 
            .addCase(fetchDeleteMyReview.pending, (state) => {
              state.deleteReviewLoading = true;
            })
            .addCase(fetchDeleteMyReview.fulfilled, (state, action) => {
              state.deleteReviewLoading = false;
              state.deleteReviewData = action.payload;
            })
            .addCase(fetchDeleteMyReview.rejected, (state, action) => {
              state.deleteReviewLoading = false;
              state.deleteReviewError = action.payload;
            })

            // view all review 
            .addCase(fetchGetAllReview.pending, (state) => {
              state.allReviewLoading = true;
            })
            .addCase(fetchGetAllReview.fulfilled, (state, action) => {
              state.allReviewLoading = false;
              state.allReviewData = action.payload;
            })
            .addCase(fetchGetAllReview.rejected, (state, action) => {
              state.allReviewLoading = false;
              state.allReviewError = action.payload;
            })
    }
})

export const {resetAllCourseData} = courseSlice.actions;
export default courseSlice.reducer;