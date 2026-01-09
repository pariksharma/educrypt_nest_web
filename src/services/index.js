import axiosClient from "./axiosClient";

const auth_url = 'auth/';
// export const app_settings = async (params) => await axiosClient.get(auth_url + 'app-setting', params)
// export const fetchCheckUser = async (params) => await axiosClient.post(auth_url + 'check-user', params)
// export const fetchVerifyOtpService = async (params) => await axiosClient.post(auth_url + 'verify-otp', params)
// export const fetchLogutService = async (params) => await axiosClient.get(auth_url + 'logout', params);
export const fetchForgetPassword = async (params) => await axiosClient.post(auth_url + 'forgot-password', params)
// export const fetchResetPassword = async (params) => await axiosClient.post(auth_url + 'reset-password', params)
// export const loginApi = (data) => apiClient.post('/auth/login', data);

export const loginApi = (data) => axiosClient.post('/auth/login', data);
export const logoutApi = (data) => axiosClient.get("/auth/logout", data);
export const signupApi = (data) => axiosClient.post("/auth/signup", data);
export const forgotPasswordApi = (data) => axiosClient.post("/auth/forgot-password", data);
export const checkUserApi = (data) => axiosClient.post("/auth/check-user", data);
export const verifyOtpApi = (data) => axiosClient.post("/auth/verify-otp", data);
export const resetPasswordApi = (data) => axiosClient.post("/auth/reset-password", data);
 
export const signupFormApi = () => axiosClient.get("/auth/signup_form");
export const countriesApi = () => axiosClient.get('/auth/countries');
export const statesApi = ({ country_id }) => axiosClient.get(`/auth/states?country_id=${country_id}`);
export const citiesApi = ({ state_id }) => axiosClient.get(`/auth/cities?state_id=${state_id}`);
export const appSettingApi = () => axiosClient.get("/auth/app-setting");
export const changeDetectorApi = () => axiosClient.get("/auth/change-detector");
 

const home_url = 'home/';
export const fetchHomeService = async (params) => await axiosClient.post(home_url + 'content', params)
export const fetchGlobalSearchService = async (params) => await axiosClient.get(home_url + `search?keyword=${params.keyword}&page=${params.page}&limit=${params.limit}`)

const course_url = 'course/';
export const fetchAllCoursesService = async (params) => await axiosClient.post(course_url + 'all-course', params)
export const fetchCourseDetailService = async (params) => await axiosClient.post(course_url + 'course-details', params)
export const fetchContentService = async (params) => await axiosClient.post(course_url + 'content', params)
export const fetchMyCourseService = async (params) => await axiosClient.get(course_url + `mycourses?type=${params?.type}&page=${params?.page}&limit=${params?.limit}`)
export const fetchLiveClassService = async (params) => await axiosClient.post(course_url + 'classes', params)
export const fetchAllReviewService = async (params) => await axiosClient.post(course_url + 'reviews', params)
export const fetchSaveCourseService = async (params) => await axiosClient.post(course_url + 'save-review', params)
export const fetchDeleteReviewService = async (params) => await axiosClient.get(course_url + `delete-review?review_id=${params.review_id}`)

const user_url = 'user/';
export const fetchMyProfileService = async (params) => await axiosClient.get(user_url + 'my-profile', params)
export const fetchUpdateProfileService = async (params) => await axiosClient.post(user_url + 'update-profile', params)

const currentAffair_url = 'current-affairs/';
export const fetchCurrentAffairService = async (params) => axiosClient.get(currentAffair_url + 'categories', params)
export const fetchCurrentAffairListService = async (params) => axiosClient.get(currentAffair_url + `current-affairs-list?category_id=${params?.category_id}&page=${params?.page}&limit=${(params?.limit || '')}&keyword=${(params?.keyword || '')}`)
export const fetchCurrentAffairDetailService = async (params) => axiosClient.get(currentAffair_url + `current-affairs-detail?current_affair_id=${params?.current_affair_id}`)


const payment_url = 'payment/';
export const fetchCourseCouponService = async (params) => axiosClient.post(payment_url + 'course-coupons', params)
export const fetchInitializePaymentService = async (params) => axiosClient.post(payment_url + 'initialize-payment', params)
export const fetchCompletePaymentService = async (params) => axiosClient.post(payment_url + 'complete-payment', params)
export const fetchVerifyCouponService = async (params) => axiosClient.post(payment_url + 'verify-coupons', params)
