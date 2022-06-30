import { useSelector } from "react-redux";
import { followUser, unfollowUser } from "../firebase/firebase-calls";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";

export default function RightSideBar() {
  const { allUsers } = useSelector((state) => state.allUsers);
  const { user } = useSelector((state) => state.user);
  const otherUsers = allUsers?.filter(
    (eachUser) => eachUser.userID !== user?.uid
  );
  const usersToFollow = otherUsers.filter(
    (eachUser) => !user?.following?.includes(eachUser.userID)
  );

  const handleFollow = (currentUser, otherUser) => {
    const isFollowing = user?.following?.some(
      (user) => user === otherUser?.userID
    );
    isFollowing
      ? unfollowUser(currentUser, otherUser)
      : followUser(currentUser, otherUser);
  };

  return (
    <div className="mx-2 hidden h-[31rem] w-fit min-w-[20rem] bg-slate-100  sm:hidden md:hidden lg:fixed lg:right-0 lg:top-16 lg:mx-1 lg:block xl:right-2">
      <div className="custom-scrollbar mx-auto flex h-full max-w-xs flex-col gap-2 overflow-y-auto rounded-md bg-gray-50 p-5 shadow-md lg:block lg:h-[90vh]">
        <h1 className="mb-2 font-semibold text-gray-700">Suggestions</h1>
        <ul className="flex flex-col gap-3">
          {usersToFollow.map((otherUser) => (
            <li
              className="my-1 flex w-full items-center justify-between gap-1"
              key={otherUser.userID}
            >
              <Link
                to={`/profile/${otherUser?.userID}`}
                className="aspect-square h-9 w-fit rounded-full object-cover"
              >
                <img
                  src={
                    otherUser?.avatar
                      ? otherUser?.avatar
                      : "http://cdn.onlinewebfonts.com/svg/img_264570.png"
                  }
                  alt="user-dp"
                  className="aspect-square h-9 w-fit rounded-full object-cover"
                />
              </Link>
              <div className="flex w-[15rem] items-center justify-between ">
                <div className="flex w-1/2 flex-col items-start ">
                  <Link to={`/profile/${otherUser?.userID}`}>
                    <p className="text-sm font-semibold">
                      {otherUser?.displayName}
                    </p>
                    <p className="w-32 overflow-hidden text-ellipsis pr-2 text-xs text-gray-500">
                      @{otherUser?.email?.split("@")[0]}
                    </p>
                  </Link>
                </div>

                {user?.following?.some((id) => id === otherUser?.userID) ? (
                  <button
                    className="rounded-full border-2 border-transparent bg-blue-200 py-1 px-2 text-sm text-gray-700 hover:brightness-95"
                    onClick={() => handleFollow(auth?.currentUser, otherUser)}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className="rounded-full  border-2 border-transparent bg-blue-500 py-1 px-2 text-sm text-gray-50 hover:brightness-90"
                    onClick={() => handleFollow(auth?.currentUser, otherUser)}
                  >
                    Follow
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
