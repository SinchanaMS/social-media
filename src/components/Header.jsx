import { MdOutlineLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "features/user/userSlice";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import logo from "assets/jigsaw.png";
export default function Header() {
  const { user } = useSelector((state) => state.user);
  const currentUser = auth?.currentUser;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    dispatch(logout());
    await signOut(auth);
    navigate("/");
    localStorage.removeItem("authToken");
  };

  return (
    <div className="flex h-14 items-center justify-between bg-slate-100 p-3 font-semibold">
      <Link to="/" className="flex h-full">
        <img src={logo} alt="main-logo" className="aspect-auto" />
        <h1 className="text-2xl text-gray-600">Jigsaw</h1>
      </Link>
      {user && (
        <div className="flex gap-4">
          <Link to="/profile">
            <img
              className="max-w-9 aspect-square h-9 max-h-9 w-fit rounded-full object-cover"
              src={currentUser?.photoURL}
              alt="user-avatar"
            />
          </Link>

          <button onClick={logoutHandler}>
            <MdOutlineLogout className="text-2xl" />
          </button>
        </div>
      )}
    </div>
  );
}
