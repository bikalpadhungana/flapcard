import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages 
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { Navigate } from "react-router-dom";

// components
import Navbar from "./components/Navbar";

import { useAuthContext } from "./hooks/use.auth.context";

export default function App() {

  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/sign-in" />} />
        <Route path="/sign-in" element={!user ? <Signin /> : <Navigate to="/home" />} />
        <Route path="/sign-up" element={!user ? <Signup /> : <Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  )
}
