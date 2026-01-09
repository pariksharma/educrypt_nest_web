import { jwtDecode } from "jwt-decode";


export const saveUserData = (data) => {
    console.log('data',data)
    if(data?.accessToken) {
        localStorage.setItem('token', data?.accessToken)
        window.location.reload();
    }
}

export const getUserData = (data) => {
    try {
        const jwt_data = localStorage.getItem('token');
        const userData = jwtDecode(jwt_data);
        // console.log(userData)
        return userData;
    } catch {
        return null;
    }
}

export const logout_user = () => {
    localStorage.removeItem('jwt');
    if(typeof window !== "undefined") {
        window.location.replace('/')
    }
}