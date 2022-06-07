import { Route, Routes } from "react-router-dom";
import Login from "features/user/Login";
import Signup from "features/user/Signup";
import Explore from "pages/explore/Explore";
import UserProfile from "pages/profile/UserProfile";
import Home from "pages/home/Home";
import OtherProfile from "pages/otherProfile/OtherProfile";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/profile/:profileID" element={<OtherProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
