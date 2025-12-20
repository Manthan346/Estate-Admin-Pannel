import axios from "axios";

const API = axios.create({
  baseURL: "https://magic-bricks-p6yv.onrender.com/v1/api",
  withCredentials: true, // 🔥 REQUIRED for refresh cookie
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 🔥 refreshToken is sent via HttpOnly cookie
        const res = await axios.post(
          "https://magic-bricks-p6yv.onrender.com/v1/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.data.accessToken;

        // Save new access token
        localStorage.setItem("token", newToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (err) {
        // Refresh failed → force logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

/* ---------------- API FUNCTIONS ---------------- */

export const LoginAdmin = (data) => {
  return API.post("auth/signin", data);
};

export const cityList = () => API.get("property/fetch-all-city");

export const fetchProject = () => API.get("property/fetch-all-project");

export const addCity = (data) => API.post("property/city", data)
export const addProject = (data) => API.post("property/project", data)

export const addNewProperty = (data) =>
  API.post("property/add-new", data);

export default API;
