import { Route, Routes } from "react-router-dom";
import RequiresAuth from "components/RequiresAuth";
import {
  Home,
  Explore,
  Bookmarks,
  Archives,
  UserProfile,
  OtherProfile,
  Error,
  Login,
  Signup,
} from "pages/pages";
import LandingPage from "pages/landingPage/LandingPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<RequiresAuth />}>
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/:profileID" element={<OtherProfile />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/archives" element={<Archives />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
