import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userLogin } from "../../firebase/firebase-calls";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const testLogin = { email: "theHippogriff@gmail.com", password: "buckbeak" };
  const { email, password } = loginDetails;
  const lastLocation = location.state?.from?.pathname || "/";

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({ ...prev, [name]: value }));
  };

  const loginHandler = (e) => {
    e.preventDefault();
    userLogin(email, password, dispatch, lastLocation, navigate);
  };

  const testLoginHandler = (e, { email, password }) => {
    e.preventDefault();
    setLoginDetails(testLogin);
    userLogin(email, password, dispatch, lastLocation, navigate);
  };

  return (
    <div className="flex h-[92vh] items-center justify-center bg-gray-200">
      <form
        className="flex h-96 w-80 flex-col items-center justify-center gap-4 rounded-md bg-slate-50 p-9 shadow-md sm:w-96"
        onSubmit={loginHandler}
      >
        <h1 className="text-xl font-semibold">Login</h1>
        <input
          type="email"
          name="email"
          value={email}
          className="h-9 w-full bg-gray-100 p-2"
          placeholder="Enter email"
          required
          onChange={changeHandler}
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            className="h-9 w-full bg-gray-100 p-2"
            placeholder="Enter password"
            required
            onChange={changeHandler}
          />
          <div role="button" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? (
              <AiFillEyeInvisible className="absolute right-2 bottom-1/2 translate-y-1/2 text-lg text-gray-500" />
            ) : (
              <AiFillEye className="absolute right-2 bottom-1/2 translate-y-1/2 text-lg text-gray-500" />
            )}
          </div>
        </div>
        <div className="mt-4 flex w-full gap-2">
          <button
            type="submit"
            className="w-1/2 rounded-md border-2 bg-gray-200 py-1 px-4"
          >
            Login
          </button>
          <div
            role="button"
            className="w-1/2 rounded-md border-2 bg-gray-200 py-1 px-4 text-center"
            onClick={(e) => testLoginHandler(e, testLogin)}
          >
            Test User
          </div>
        </div>
        <p>
          <Link to="/signup" className="font-semibold text-gray-500">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}
