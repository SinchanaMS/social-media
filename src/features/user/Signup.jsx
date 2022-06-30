import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { signup } from "./userSlice";
import { defaultAvatar } from "utils/Constants";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState("");

  const [signupDetails, setSignUpDetails] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: defaultAvatar.avatar,
    confirmPassword: "",
  });
  const { email, password, confirmPassword, name, profilePic } = signupDetails;

  const changeHandler = (e) => {
    setSignupError("");
    const { name, value } = e.target;
    setSignUpDetails((prev) => ({ ...prev, [name]: value }));
  };

  const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
  );

  const submitSignUp = async (e) => {
    e.preventDefault();
    if (password[0] === " ") {
      setSignupError("Password cannot start with an empty space");
    } else if (!passwordRegex.test(password)) {
      setSignupError("Password must be alphanumeric");
    } else if (password.length < 6) {
      setSignupError("Password must be at least 6 characters");
    } else if (password === confirmPassword) {
      const loader = toast.loading("Signing you up..");
      try {
        const userAuth = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userAuth.user, {
          displayName: name,
          photoURL: profilePic,
        });

        dispatch(
          signup({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: name,
            photoURL: profilePic,
            coverPic: defaultAvatar.cover,
            bio: "",
            posts: [],
            followers: [],
            following: [],
            archives: [],
            bookmarks: [],
          })
        );
        const userRef = collection(db, "users");
        await setDoc(
          doc(userRef, userAuth.user.uid),
          {
            email: userAuth.user.email,
            userID: userAuth.user.uid,
            displayName: name,
            avatar: userAuth.user.photoURL,
            coverPic: defaultAvatar.cover,
            bio: "",
            posts: [],
            followers: [],
            following: [],
            archives: [],
            bookmarks: [],
          },
          { merge: true }
        );
        localStorage.setItem("authToken", userAuth.user.accessToken);
        toast.success(`Welcome to Jigsaw, ${name}!!`, { id: loader });
        navigate("/home");
      } catch (error) {
        console.log(error);
        toast.error(`Couldn't sign you up. Please try again!`, { id: loader });
      }
    } else {
      setSignupError("Passwords don't match");
    }
  };

  return (
    <div>
      <div className="flex h-[92vh] items-center justify-center bg-[url('assets/puzzle.webp')] ">
        <form
          className="flex w-80 flex-col items-center justify-center gap-4 rounded-md bg-slate-50 p-9 shadow-md sm:w-96"
          onSubmit={submitSignUp}
        >
          <h1 className="text-xl font-semibold">Create Account</h1>
          <input
            type="text"
            name="name"
            className="h-9 w-full bg-gray-100 p-2"
            placeholder="Enter name"
            required
            onChange={changeHandler}
          />
          <input
            type="email"
            name="email"
            className="h-9 w-full bg-gray-100 p-2"
            placeholder="Enter email"
            required
            onChange={changeHandler}
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
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
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="h-9 w-full bg-gray-100 p-2"
              placeholder="Confirm password"
              required
              onChange={changeHandler}
            />
            <div
              role="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <AiFillEyeInvisible className="absolute right-2 top-0 translate-y-1/2 text-lg text-gray-500" />
              ) : (
                <AiFillEye className="absolute right-2 top-0 translate-y-1/2 text-lg text-gray-500" />
              )}
            </div>
            <p className="ml-1 mt-1 text-xs text-gray-500">
              *Password must be minimum 6 characters long and alphanumeric.
            </p>
            <p className="mt-2 ml-1 text-sm text-red-600">{signupError}</p>
          </div>
          <button
            type="submit"
            className="w-1/2 rounded-md border-2 border-transparent bg-blue-700 py-2 px-6 text-gray-100 hover:brightness-90"
          >
            Sign Up
          </button>
          <p>
            Existing User?
            <Link to="/login" className="ml-2 font-semibold text-blue-800">
              Login
            </Link>
          </p>
        </form>
      </div>
      <p className="absolute bottom-0 right-2 text-xs text-gray-400">
        Illustration from https://dribbble.com/gigantic_click
      </p>
    </div>
  );
}
