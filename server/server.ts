import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import aiRoute from "./routes/aiRoutes";

dotenv.config();

const app = express();

app.use('/api/subnotes', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: {
    '^/': '/subnotes/'
  }
}));

app.use(cors());
app.use(express.json());
app.use("/api/ai", aiRoute);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (_req, res) => {
  res.send("API Running...");
});

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});