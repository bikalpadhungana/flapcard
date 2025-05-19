import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom";


// Pages
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Learn from "./pages/Learn";
import TermsOfService from "./pages/TermsOfService";
import BusinessProfile from "./pages/BusinessProfile";

import Explore from "./pages/Explore";
import PlaceOrder from "./pages/PlaceOrder";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import UserInfo from "./pages/UserInfo";
import Entrepreneur from "./theme/Entrepreneur";
import Student from "./theme/Student";
import Ai from "./theme/Ai";
import Payments from "./theme/Payments";
import Business from "./theme/Business";
import Artist from "./theme/Artist";

import Developer from "./theme/Developer";

import Healthcare from "./theme/Healthcare";
import CreateCard from "./pages/CreateCard";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/404notfound";
import Contact from "./pages/Contact";
import Agent from "./pages/Agent";
import { useAuthContext } from "./hooks/use.auth.context";
import AdminAppLayout from "./ui/AdminAppLayout";
import Order from "./pages/Orders";
import Users from "./pages/Users";
import Landing from "./pages/Landing";

export default function App() {
  const { user } = useAuthContext();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      <Route path="/place-order" element={<PlaceOrder />} />
      <Route path="/PrivacyPolicy" element={<TermsOfService />} />
      {/* Protected routes */}
      <Route 
        path="/profile" 
        element={user ? <Profile /> : <Navigate to="/sign-in" />} 
      />
       <Route 
        path="/businessprofile" 
        element={user ? <BusinessProfile /> : <Navigate to="/businessprofile" />} 
      />
      
      <Route 
        path="/chat" 
        element={user ? <Chat /> : <Navigate to="/chat" />} 
      />
      <Route 
        path="/learn" 
        element={user ? <Learn /> : <Navigate to="/sign-in" />} 
      />
      <Route 
        path="/explore" 
        element={user ? <Explore /> : <Navigate to="/sign-in" />} 
      />
      <Route 
        path="/sign-in" 
        element={!user ? <Signin /> : <Navigate to="/profile" />} 
      />
      <Route 
        path="/sign-up" 
        element={!user ? <Signup /> : <Navigate to="/profile" />} 
      />
      
      <Route path="/create-card" element={<CreateCard />} />
      
      <Route path="/:id" element={<UserInfo />} /> {/* Dynamic user info route */}
      <Route path="UserDashboard/:id" element={<UserDashboard />} /> 
      <Route path="Entrepreneur/:id" element={<Entrepreneur />} /> 
      <Route path="Student/:id" element={<Student />} /> 
      <Route path="Business/:id" element={<Business />} /> 
      <Route path="Artist/:id" element={<Artist />} /> 
      <Route path="Developer/:id" element={<Developer />} /> 
      <Route path="Healthcare/:id" element={<Healthcare />} /> 
      <Route path="Ai/:id" element={<Ai />} /> 
      <Route path="Payments/:id" element={<Payments />} /> 
      <Route path="users" element={<Users />} /> 
      <Route path="Chat/:id" element={<Chat />} />
      
      <Route path="Learn/:id" element={<Learn />} /> 
      <Route path="Explore/:id" element={<Explore />} /> 
      <Route path="contact/:id" element={<Contact />} /> 
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminAppLayout />}>
        <Route index element={<Navigate replace to="Dashboard" />} />
        <Route path="Entrepreneur/:id" element={<Entrepreneur />} />
        <Route path="Student/:id" element={<Student />} />
        <Route path="Business/:id" element={<Business />} />
        <Route path="Artist/:id" element={<Artist />} />
        <Route path="Developer/:id" element={<Developer />} /> 
        <Route path="Healthcare/:id" element={<Healthcare />} />

        <Route path="Ai/:id" element={<Ai />} />
        <Route path="Users" element={<Users />} />
        <Route path="Contact/:id" element={<Contact />} />
        <Route path="Agent/:id" element={<Agent />} />
        <Route path="orders" element={<Order />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}