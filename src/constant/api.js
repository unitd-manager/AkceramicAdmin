import axios from "axios";

// const api = axios.create({
//   baseURL: "https://akceramicworldadmin.unitdtechnologies.com:4001"
// });

// // 🔥 attach token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;

// import axios from 'axios'

const api = axios.create({
baseURL: 'https://akceramicworldadmin.unitdtechnologies.com:4005',
// baseURL: 'http://localhost:5000'
});

export default api