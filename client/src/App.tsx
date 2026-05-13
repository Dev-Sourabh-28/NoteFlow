import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/verifyOtp";
import ResetPassword from "./pages/ResetPassword";
import SharedNote from "./pages/SharedNote";

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/verify-otp" element={<VerifyOtp/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="/shared/:shareId" element={<SharedNote/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;