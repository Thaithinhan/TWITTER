
import axios from 'axios';

// import jwt_decode, { JwtPayload } from 'jwt-decode'; // Import jwt_decode

const BaseAxios = axios.create({
    baseURL: "http://localhost:8000",
    // headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    // },
});
BaseAxios.defaults.withCredentials = true;

// function isAccessTokenExpired() {
//     let token = localStorage.getItem("accessToken") as string;
//     token = JSON.parse(token);
//     if (token) {
//         const decodedToken = jwt_decode<JwtPayload>(token);
//         const currentTime = Date.now() / 1000;
//         // Kiểm tra trường exp trước khi sử dụng
//         return decodedToken.exp !== undefined && decodedToken.exp < currentTime;
//     }
//     return true;
// }

BaseAxios.interceptors.request.use(
    async (config) => {
        // if (isAccessTokenExpired()) {
        //     // Gọi API để lấy Access Token mới từ Refresh Token
        //     try {
        //         const response = await BaseAxios.post('/api/v1/users/refresh-token');
        //         const newAccessToken = response.data.accessToken;
        //         localStorage.setItem('accessToken', JSON.stringify(newAccessToken));
        //     } catch (error) {
        //         console.log('Failed to refresh access token:', error);
        //     }
        // }
        let token = localStorage.getItem("accessToken") || "";
        try {
            token = JSON.parse(token);

        } catch (e) {
            console.log(e);
        }
        if (token !== null) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);
// after send request
BaseAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default BaseAxios;
