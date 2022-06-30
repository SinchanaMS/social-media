import { auth } from "../firebase/firebase";
import { FiTrash } from "react-icons/fi";
import { deleteComment } from "../firebase/firebase-calls";

export default function Comment({ comment, post }) {
  const currentUser = auth?.currentUser;
  return (
    <div className="relative my-3 flex flex-col rounded-md bg-blue-50 p-2">
      <div className="flex gap-2">
        <img
          src={comment.avatar}
          alt="commenter-dp"
          className="aspect-square h-7 rounded-full"
        />
        <p className="text-sm font-semibold">{comment.displayName}</p>
      </div>
      <p className="ml-8 text-gray-700">{comment.comment}</p>
      <p className="ml-8 mt-1 text-xs text-gray-500">{comment.date}</p>

      {comment.userID === currentUser.uid && (
        <button
          className="absolute right-5 top-4 text-sm"
          onClick={() => deleteComment(post, comment)}
        >
          <FiTrash />
        </button>
      )}
    </div>
  );
}
