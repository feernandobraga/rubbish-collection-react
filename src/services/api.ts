import axios from "axios";

const api = axios.create({
  // this is the base URL for the API. Therefore, if the address updates we just have to change it in one place
  baseURL: "http://localhost:3333",
});

export default api;
