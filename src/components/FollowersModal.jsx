import { useSelector } from "react-redux";
import { AiFillCloseCircle } from "react-icons/ai";
import { auth } from "../firebase/firebase";
import { followUser, unfollowUser } from "../firebase/firebase-calls";
import { Link } from "react-router-dom";

export default function FollowersModal({
  setShowFollowersModal,
  showFollowers,
  setShowFollowers,
  showFollowing,
  setShowFollowing,
  user,
}) {
  const { allUsers } = useSelector((state) => state.allUsers);

  const followersList = user?.followers.map((user) =>
    allUsers.find((eachUser) => eachUser.userID === user)
  );

  const followingList = user?.following.map((user) =>
    allUsers.find((eachUser) => eachUser.userID === user)
  );

  const handleFollow = (currentUser, follower) => {
    const isFollowing = user?.following?.some(
      (user) => user === follower?.userID
    );
    isFollowing
      ? unfollowUser(currentUser, follower)
      : followUser(currentUser, follower);
  };

  return (
    <div className="fixed top-1/2 right-1/2 z-20 flex min-h-[24rem] w-80 min-w-[20rem] max-w-[40rem] translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-md bg-slate-50 p-4 sm:w-3/4 md:bottom-0 md:w-2/3 md:-translate-y-3/4 lg:w-1/2">
      <AiFillCloseCircle
        className="absolute right-2 top-2 z-20 rounded-full bg-slate-100 text-3xl text-gray-500 hover:cursor-pointer  hover:brightness-90"
        onClick={() => setShowFollowersModal((prev) => !prev)}
      />
      <div className="mt-3 flex w-full items-start gap-1">
        <h1
          className={`w-full rounded-md ${
            showFollowers ? `bg-blue-500 text-gray-50` : `bg-blue-200`
          } py-2 text-center font-semibold text-gray-700 hover:cursor-pointer hover:brightness-95`}
          onClick={() => {
            setShowFollowers((prev) => !prev);
            setShowFollowing(false);
          }}
        >
          Followers
        </h1>
        <h1
          className={`w-full rounded-md ${
            showFollowing ? `bg-blue-500 text-gray-50` : `bg-blue-200`
          } py-2 text-center font-semibold text-gray-700 hover:cursor-pointer hover:brightness-95`}
          onClick={() => {
            setShowFollowing((prev) => !prev);
            setShowFollowers(false);
          }}
        >
          Following
        </h1>
      </div>
      {showFollowers && (
        <ul className="custom-scrollbar flex h-full flex-col gap-2 overflow-y-auto">
          {followersList?.map((follower) => (
            <li
              className="flex w-full items-center justify-between gap-2 bg-slate-100 px-2 py-3 md:gap-4 md:px-10"
              key={follower?.userID}
            >
              <Link
                to={`/profile/${follower?.userID}`}
                className="aspect-square h-9 w-fit rounded-full object-cover"
              >
                <img
                  src={
                    follower?.avatar
                      ? follower?.avatar
                      : "http://cdn.onlinewebfonts.com/svg/img_264570.png"
                  }
                  alt="user-dp"
                  className="aspect-square h-9 w-fit rounded-full object-cover"
                />
              </Link>
              <div className="flex w-full items-center justify-between ">
                <div className="flex w-1/2 flex-col items-start ">
                  <Link to={`/profile/${follower?.userID}`}>
                    <p className="text-sm font-semibold">
                      {follower?.displayName}
                    </p>
                    <p className="w-32 overflow-hidden text-ellipsis pr-2 text-xs text-gray-500">
                      @{follower?.email?.split("@")[0]}
                    </p>
                  </Link>
                </div>

                {user?.uid === auth?.currentUser?.uid &&
                  (user?.following?.some(
                    (user) => user === follower?.userID
                  ) ? (
                    <button
                      className="rounded-full border-2 border-transparent bg-blue-200 py-1 px-2 text-sm text-gray-700 hover:brightness-95"
                      onClick={() => handleFollow(auth?.currentUser, follower)}
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      className="rounded-full  border-2 border-transparent bg-blue-500 py-1 px-2 text-sm text-gray-50 hover:brightness-90"
                      onClick={() => handleFollow(auth?.currentUser, follower)}
                    >
                      Follow
                    </button>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      )}
      {showFollowing && (
        <ul className="custom-scrollbar flex h-full flex-col gap-2 overflow-y-auto">
          {followingList?.map((followingUser) => (
            <li
              className="flex w-full items-center justify-between gap-2 bg-slate-100 px-2 py-3 md:gap-4 md:px-10"
              key={followingUser.userID}
            >
              <Link
                to={`/profile/${followingUser?.userID}`}
                className="aspect-square h-9 w-fit rounded-full object-cover"
              >
                <img
                  src={
                    followingUser?.avatar
                      ? followingUser?.avatar
                      : "http://cdn.onlinewebfonts.com/svg/img_264570.png"
                  }
                  alt="user-dp"
                  className="aspect-square h-9 w-fit rounded-full object-cover"
                />
              </Link>
              <div className="flex w-full items-center justify-between ">
                <div className="flex w-1/2 flex-col items-start ">
                  <Link to={`/profile/${followingUser?.userID}`}>
                    <p className="text-sm font-semibold">
                      {followingUser?.displayName}
                    </p>
                    <p className="w-32 overflow-hidden text-ellipsis pr-2 text-xs text-gray-500">
                      @{followingUser?.email?.split("@")[0]}
                    </p>
                  </Link>
                </div>
                {user?.uid === auth?.currentUser?.uid && (
                  <button
                    className="rounded-full border-2 border-transparent bg-blue-200 py-1 px-2 text-sm text-gray-700 hover:brightness-95"
                    onClick={() =>
                      unfollowUser(auth?.currentUser, followingUser)
                    }
                  >
                    Following
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
