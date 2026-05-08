import axios from "axios";
import type { CreateSubnoteDto } from "../types/subnote";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const subnoteAPI = {
  create: (data: CreateSubnoteDto) => 
    API.post("/api/subnotes", data),
}

export default API;