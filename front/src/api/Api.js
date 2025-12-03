import axios from "axios";

const useInternalAPI = import.meta.env.VITE_USE_INTERNAL_API === "true";
const apiBaseUrl = useInternalAPI ? "/api" : import.meta.env.VITE_EXTERNAL_API_BASE;

console.log("API Base URL:", apiBaseUrl);

const backendApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default backendApi;