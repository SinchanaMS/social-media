import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiEdit3 } from "react-icons/fi";
import { auth } from "../../firebase/firebase";
import { getUser } from "../../firebase/firebase-calls";
import EditProfileModal from "./EditProfileModal";
import { Post } from "components/components";
import FollowersModal from "components/FollowersModal";

export default function UserProfile() {
  const { user } = useSelector((state) => state.user);
  const { allPosts } = useSelector((state) => state.allPosts);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const currentUser = auth?.currentUser;

  const filteredPosts = allPosts?.filter(
    (post) => post.uid === currentUser?.uid
  );

  useEffect(
    () => {
      if (currentUser) getUser(currentUser, setUserData);
    },
    // eslint-disable-next-line
    [currentUser]
  );

  return (
    <div className="ml-0 flex w-full flex-col items-center pt-4 sm:ml-0 md:ml-0 lg:ml-1.5 lg:mr-0">
      <section className="relative h-72 w-full lg:ml-8 lg:mr-6 lg:w-[95%] xl:ml-2 xl:mr-0.5 xl:w-[94%]">
        {userData.coverPic && (
          <img
            src={userData.coverPic}
            alt="cover"
            className="mx-auto h-fit max-h-72 w-full object-cover"
          />
        )}
        <div className="absolute right-1/2 -bottom-1/2 mx-auto flex h-fit w-80 translate-x-1/2 flex-col items-center gap-2 rounded-lg bg-slate-50 py-3 px-2 shadow sm:w-96 md:w-96 lg:w-96">
          <button
            className="absolute right-4 rounded-full border-none bg-slate-100 p-1.5 text-2xl text-gray-600 shadow-md hover:cursor-pointer hover:brightness-95 "
            onClick={() => setShowModal((prev) => !prev)}
          >
            <FiEdit3 />
          </button>

          <img
            src={user?.photoURL}
            alt="user-dp"
            className="md:h-18 lg:h-18 aspect-square h-14 w-fit rounded-full object-cover xl:h-24"
          />
          <p className="text-lg font-semibold">{currentUser?.displayName}</p>
          <p className="text-center text-sm sm:text-base">{userData?.bio}</p>
          <p className="text-sm sm:text-base">{userData?.website}</p>
          <div className="flex flex-wrap justify-center gap-1 px-2 text-slate-50 sm:gap-2 md:w-full md:justify-center md:gap-3 md:px-0 lg:scale-100 lg:gap-5">
            <div
              className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1 shadow-md hover:cursor-pointer"
              onClick={() => {
                setShowFollowersModal((prev) => !prev);
                setShowFollowers(true);
                setShowFollowing(false);
              }}
            >
              {userData?.followers?.length} Followers
            </div>
            <div
              className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1 shadow-md hover:cursor-pointer"
              onClick={() => {
                setShowFollowersModal((prev) => !prev);
                setShowFollowing(true);
                setShowFollowers(false);
              }}
            >
              {user?.following?.length > 0 ? user?.following?.length : "0"}{" "}
              Following
            </div>
            <div className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1 shadow-md hover:cursor-default">
              {filteredPosts?.length} Posts
            </div>
          </div>
        </div>
      </section>

      {showFollowersModal && (
        <div className="h-full">
          <div className="fixed inset-0 z-10 flex h-screen w-full items-center justify-center bg-gray-900 opacity-70"></div>
          <FollowersModal
            setShowFollowersModal={setShowFollowersModal}
            showFollowers={showFollowers}
            setShowFollowers={setShowFollowers}
            showFollowing={showFollowing}
            setShowFollowing={setShowFollowing}
            user={user}
            key={user?.userID}
          />
        </div>
      )}
      {showModal && (
        <div className="h-full">
          <div className="fixed inset-0 z-10 flex h-screen w-full items-center justify-center bg-gray-900 opacity-70"></div>
          <EditProfileModal
            setShowModal={setShowModal}
            userData={userData}
            setUserData={setUserData}
            key={userData?.userID}
          />
        </div>
      )}
      <ul className="mt-44 mb-16 w-full md:mb-24">
        {filteredPosts?.map((post) => (
          <Post post={post} key={post?.postID} />
        ))}
      </ul>
    </div>
  );
}
