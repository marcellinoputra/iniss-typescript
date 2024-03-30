import axios from "axios";

const axiosNew = axios.create({
  baseURL: `${import.meta.env.VITE_BASEURL_INISS + import.meta.env.VITE_BASEURL_VERSION}`,
  timeoutErrorMessage:"Timeout",
  timeout: 10000,
  headers: {
    'ngrok-skip-browser-warning': 'any'
  },
});

export default axiosNew;
