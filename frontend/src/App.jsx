import { Routes, Route, useNavigate ,Navigate} from "react-router-dom";

// pages
import Profile from "./pages/Profile";
import PlaceOrder from "./pages/PlaceOrder";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import UserInfo from "./pages/UserInfo";
import CreateCard from "./pages/CreateCard";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/404notfound";

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
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/sign-in" />}
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
      <Route path="/user-info/:id" element={<UserInfo />} />
      <Route path="/admin" element={<AdminAppLayout />}>
        <Route index element={<Navigate replace={true} to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<Order />} />
      </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
}
