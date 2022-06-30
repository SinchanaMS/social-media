import { useDispatch, useSelector } from "react-redux";
import { AiFillCloseCircle } from "react-icons/ai";
import { auth } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { profileUpdate, uploadImage } from "../../firebase/firebase-calls";
import toast from "react-hot-toast";
import { FiEdit3 } from "react-icons/fi";

export default function EditProfileModal({
  setShowModal,
  userData,
  setUserData,
}) {
  const { user } = useSelector((state) => state.user);
  const currentUser = auth?.currentUser;

  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    coverPic: "",
    avatar: "",
    bio: "",
    website: "",
  });

  const updateUserInfo = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserImage = async (e) => {
    const file = e.target.files[0];
    const field = e.target.name;
    const loader = toast.loading("uploading image");
    const path = `images/${currentUser.uid}/${file.name}`;
    const fieldURL = await uploadImage(path, file);
    toast.success("uploaded image", { id: loader });
    setUserInfo({ ...userInfo, [field]: fieldURL });
  };

  const updateUserData = async (e) => {
    e.preventDefault();
    await setUserData((prev) => ({
      ...prev,
      coverPic: userInfo?.coverPic ? userInfo?.coverPic : userData.coverPic,
      avatar: userInfo?.avatar ? userInfo?.avatar : userData.avatar,
      bio: userInfo?.bio ? userInfo?.bio : userData.bio,
      website: userInfo?.website ? userInfo?.website : userData.website,
    }));
    setShowModal(false);
  };

  useEffect(() => {
    profileUpdate(userInfo, userData, currentUser, dispatch);
    // eslint-disable-next-line
  }, [userData]);

  return (
    <div className="fixed top-1/2 right-1/2 z-20 w-80 min-w-[20rem] max-w-[90%] translate-x-1/2 -translate-y-1/2 sm:w-3/4 md:bottom-0 md:w-2/3 md:-translate-y-3/4 lg:w-1/2">
      <form
        className="flex h-fit flex-col rounded-md bg-slate-200 p-4"
        onSubmit={updateUserData}
      >
        <AiFillCloseCircle
          className="absolute right-2 top-2 z-20 rounded-full bg-slate-100 text-3xl text-gray-500 hover:cursor-pointer  hover:brightness-90"
          onClick={() => setShowModal((prev) => !prev)}
        />
        <div className="relative">
          <img
            src={userInfo?.coverPic ? userInfo?.coverPic : userData?.coverPic}
            alt="updated-dp"
            className="relative mx-auto aspect-auto max-h-48 w-full object-cover"
          />
          <label
            htmlFor="coverPic"
            className="absolute right-8 top-5 rounded-md bg-slate-100 px-2 py-1 text-sm shadow-lg hover:cursor-pointer hover:brightness-95"
          >
            <input
              type="file"
              id="coverPic"
              name="coverPic"
              accept="image/*, .gif"
              className="hidden"
              onChange={handleUserImage}
            />
            Edit Cover Pic
          </label>
          <div className="absolute top-3/4 right-1/2 mx-auto flex h-fit w-80 max-w-[90%] translate-x-1/2 flex-col items-center gap-2 rounded-lg bg-slate-50 py-3 px-2 shadow sm:top-2/3 md:top-3/4 md:w-2/3 lg:w-80 xl:-bottom-1/2">
            <img
              src={userInfo?.avatar ? userInfo?.avatar : user?.photoURL}
              alt="updated-dp"
              className="md:h-18 lg:h-18 aspect-square h-14 w-fit rounded-full object-cover xl:h-24"
            />
            <label
              htmlFor="avatar"
              className=" lg:text-normal absolute top-2 right-3 rounded-full border-none bg-slate-100 p-1.5 text-gray-500 shadow-md hover:cursor-pointer hover:brightness-95 sm:top-3 sm:right-4 sm:text-xl md:right-5 xl:top-5"
            >
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*, .gif"
                className="hidden"
                onChange={handleUserImage}
              />
              <FiEdit3 />
            </label>
          </div>
        </div>

        <textarea
          type="text"
          name="bio"
          placeholder="Update Bio"
          className="m-2 mt-12 p-2 focus:outline focus:outline-1 focus:outline-slate-400 sm:mt-16 md:mt-20 lg:mt-16 xl:mt-28"
          onChange={updateUserInfo}
        />
        <input
          type="text"
          name="website"
          placeholder="Update Website/Portfolio"
          className="m-2 p-2 focus:outline focus:outline-1 focus:outline-slate-400"
          onChange={updateUserInfo}
        />
        <button
          type="submit"
          className="mx-auto mt-2 w-fit rounded-lg bg-slate-100 p-2 outline-none hover:cursor-pointer hover:bg-slate-300"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
