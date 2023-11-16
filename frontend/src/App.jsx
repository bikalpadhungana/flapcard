import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages 
import About from "./pages/About";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signout from "./pages/Signout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-out" element={<Signout />} />
      </Routes>
    </BrowserRouter>
  )
}
