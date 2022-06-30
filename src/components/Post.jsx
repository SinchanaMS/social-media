import { useEffect, useState } from "react";
import { FiEdit3, FiTrash, FiCheck, FiHeart } from "react-icons/fi";
import {
  RiEmotionLaughLine,
  RiInboxArchiveLine,
  RiInboxUnarchiveLine,
} from "react-icons/ri";
import { auth } from "../firebase/firebase";
import { Comment } from "./components";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import {
  archivePost,
  bookmarkPost,
  deletePost,
  dislikePost,
  editPost,
  likePost,
  postComment,
  unarchivePost,
  undoBookmarkPost,
  uploadImage,
} from "../firebase/firebase-calls";
import {
  FaHeart,
  FaRegCommentAlt,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";

export default function Post({ post }) {
  const currentUser = auth?.currentUser;
  const { allUsers } = useSelector((state) => state.allUsers);
  const { user } = useSelector((state) => state.user);
  const [enableEdit, setEnableEdit] = useState(false);
  const [enableComments, setEnableComments] = useState(false);
  const [comment, setComment] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const [updatePost, setUpdatePost] = useState({
    caption: post?.caption,
    imageURL: post?.imageURL,
  });

  const editPostHandler = () => {
    editPost(post, updatePost);
    setEnableEdit(false);
  };

  const handlePostImage = async (e) => {
    const file = e.target.files[0];
    const loader = toast.loading("uploading image");
    const path = `images/${currentUser.uid}/${file.name}`;
    const imageURL = await uploadImage(path, file);
    toast.success("uploaded image", { id: loader });
    setUpdatePost((prev) => ({
      ...prev,
      imageURL: imageURL,
    }));
  };

  const toggleLike = ({ likes, postID }) => {
    const userExists = likes?.some((user) => user.userID === currentUser?.uid);
    userExists
      ? dislikePost(postID, currentUser)
      : likePost(postID, currentUser);
  };

  const toggleArchive = (post) => {
    const isArchived = user?.archives?.some(
      ({ postID }) => postID === post?.postID
    );
    isArchived
      ? unarchivePost(post, currentUser)
      : archivePost(post, currentUser);
  };

  const toggleBookmark = (post) => {
    const isBookmarked = user?.bookmarks?.some(
      ({ postID }) => postID === post?.postID
    );
    isBookmarked
      ? undoBookmarkPost(post, currentUser)
      : bookmarkPost(post, currentUser);
  };

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  useEffect(
    () => {
      setUpdatePost({
        ...updatePost,
        caption:
          updatePost.caption +
          (chosenEmoji ? chosenEmoji.emoji.toString() : ""),
      });
    },
    // eslint-disable-next-line
    [chosenEmoji]
  );

  return (
    <div className="relative mx-auto mt-2 mb-8 flex h-fit w-full min-w-[20rem] max-w-[90%] flex-col gap-3 rounded-lg bg-gray-50 p-4 shadow-md sm:w-3/4 md:mx-auto md:w-3/4 lg:w-[80%]">
      <Link to={`/profile/${post.uid}`}>
        <header className="flex items-center gap-2 ">
          <img
            src={allUsers?.find((user) => user.userID === post?.uid)?.avatar}
            alt="user-dp"
            className="aspect-square h-9 w-fit rounded-full object-cover "
          />
          <div className="flex w-full flex-col  justify-between">
            <p className="font-semibold">{post?.author}</p>
            <p className="text-xs text-gray-600">{post?.createdAt}</p>
          </div>
        </header>
      </Link>

      {enableEdit ? (
        <div className="flex flex-col ">
          <textarea
            value={updatePost?.caption}
            className="ml-10 pl-1 focus:outline-none"
            onChange={(e) =>
              setUpdatePost((prev) => ({ ...prev, caption: e.target.value }))
            }
          />
          <div className="my-2 flex self-end">
            <div
              className="relative self-end rounded-md bg-slate-100 px-2 py-1 text-sm text-gray-500 shadow-sm hover:cursor-pointer hover:text-gray-700"
              onClick={(e) => setShowEmojis((prev) => !prev)}
            >
              <RiEmotionLaughLine className="text-xl " />
              {showEmojis && (
                <div className="emojipicker absolute top-8 right-0 z-30">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    pickerStyle={{ height: "220px" }}
                  />
                </div>
              )}
            </div>
            <label
              htmlFor="avatar"
              className="mx-2 self-end rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold text-gray-500 shadow-sm hover:cursor-pointer hover:text-gray-700"
            >
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*, .gif"
                className="hidden"
                onChange={handlePostImage}
              />
              Add/Edit Image
            </label>
            </div>
            {updatePost?.imageURL && (
              <img
                src={updatePost?.imageURL}
                alt="post-one"
                className="mx-auto mt-2 aspect-auto max-h-96"
              />
            )}
          
        </div>
      ) : (
        <div>
          <p className="pl-11 text-base text-gray-600">{updatePost?.caption}</p>
          {updatePost?.imageURL && (
            <img
              src={updatePost?.imageURL}
              alt="post-one"
              className="mx-auto mt-2 aspect-auto max-h-96"
            />
          )}
        </div>
      )}

      {post.uid === currentUser?.uid && (
        <div className="absolute top-5 right-4 flex gap-4 text-gray-600">
          {enableEdit ? (
            <button
              className="rounded-full border-none bg-slate-100 py-1.5 px-2 text-gray-500 shadow-md hover:cursor-pointer hover:brightness-95 "
              onClick={() => editPostHandler(post, updatePost)}
            >
              <FiCheck />
            </button>
          ) : (
            currentPath !== "/archives" &&
            currentPath !== "/bookmarks" && (
              <button
                className="rounded-full border-none bg-slate-100  py-1.5 px-2 text-gray-500 shadow-md hover:cursor-pointer hover:brightness-95 "
                onClick={() => setEnableEdit((prev) => !prev)}
              >
                <FiEdit3 />
              </button>
            )
          )}
          {currentPath !== "/archives" && currentPath !== "/bookmarks" && (
            <button
              className="rounded-full border-none bg-slate-100 py-1.5 px-2 text-gray-500 shadow-md hover:cursor-pointer hover:brightness-95 "
              onClick={() => deletePost(post)}
            >
              <FiTrash />
            </button>
          )}
          <button
            className="rounded-full border-none bg-slate-100 p-1.5 text-gray-500 shadow-md hover:cursor-pointer hover:brightness-95 "
            onClick={() => toggleArchive(post)}
          >
            {user?.archives?.some(({ postID }) => postID === post?.postID) ? (
              <RiInboxUnarchiveLine className="text-xl" />
            ) : (
              <RiInboxArchiveLine className="text-xl" />
            )}
          </button>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 text-gray-500">
        <div className="flex items-center justify-start gap-5 ">
          <div className="flex items-center gap-2 text-lg">
            {post?.likes?.find((user) => user.userID === currentUser?.uid) ? (
              <button
                className="rounded-full border-none bg-slate-100 p-1.5 text-gray-500 shadow-md hover:cursor-pointer hover:brightness-95 "
                onClick={() => toggleLike(post)}
              >
                <FaHeart className="text-red-700" />
              </button>
            ) : (
              <button
                className="rounded-full border-none bg-slate-100 p-1.5 text-gray-500 shadow-md hover:cursor-pointer hover:brightness-95 "
                onClick={() => toggleLike(post)}
              >
                <FiHeart />
              </button>
            )}
            {post?.likes?.length > 0 && post.likes.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full border-none bg-slate-100 p-1.5 text-gray-500 shadow-md hover:cursor-pointer hover:brightness-95 "
              onClick={() => setEnableComments((prev) => !prev)}
            >
              <FaRegCommentAlt />
            </button>
            {post?.comments?.length > 0 && post.comments.length}
          </div>
        </div>
        <button
          className="rounded-full border-none bg-slate-100 p-1.5 text-gray-500 shadow-md hover:cursor-pointer hover:brightness-95 "
          onClick={() => toggleBookmark(post, currentUser)}
        >
          {user?.bookmarks?.some(({ postID }) => postID === post?.postID) ? (
            <FaBookmark />
          ) : (
            <FaRegBookmark />
          )}
        </button>
      </div>

      {enableComments && (
        <footer>
          <div className="relative w-full px-1">
            <textarea
              placeholder="Drop a comment.."
              className="mt-2 w-full resize-none bg-gray-100 px-2 py-2 text-sm focus:outline-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="absolute right-4 bottom-1/2 translate-y-1/2 rounded-md border-none bg-blue-500 px-3 py-1 text-sm text-gray-100"
              onClick={() => {
                postComment(post, comment, currentUser);
                setComment("");
              }}
            >
              Post
            </button>
          </div>
          {post?.comments?.map((comment) => (
            <Comment comment={comment} post={post} key={comment} />
          ))}
        </footer>
      )}
    </div>
  );
}
