import axios from "axios";
import type { CreateSubnoteDto, UpdateSubnoteDto } from "../types/subnote";

// For Express server (notes)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// For NestJS server (subnotes)
const NEST_API = axios.create({
  baseURL: import.meta.env.VITE_NEST_API_URL || "http://localhost:/5001api",
});

// Add interceptors to both
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

NEST_API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const subnoteAPI = {
  create: (data: CreateSubnoteDto) => 
    NEST_API.post("/subnotes", data),

  getByNote: (noteId: string) => 
    NEST_API.get(`/subnotes/${noteId}`),

  update: (id: string, data: UpdateSubnoteDto) =>
    NEST_API.put(`/subnotes/${id}`, data),

  delete: (id: string) => 
    NEST_API.delete(`/subnotes/${id}`)
}

export default API; // Export API for notes