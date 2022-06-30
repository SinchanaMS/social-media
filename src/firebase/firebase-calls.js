import { login, updateDP } from "features/user/userSlice";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import toast from "react-hot-toast";
import { auth, db, storage } from "./firebase";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const allPostsCollection = collection(db, "allPosts");
const usersCollection = collection(db, "users");
const date = new Date().toLocaleDateString("en-IN", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export const userLogin = async (
  email,
  password,
  dispatch,
  lastLocation,
  navigate
) => {
  const loader = toast.loading("Signing you in..");
  try {
    const userAuth = await signInWithEmailAndPassword(auth, email, password);
    dispatch(
      login({
        email: userAuth.user.email,
        uid: userAuth.user.uid,
        displayName: userAuth.user.displayName,
        photoURL: userAuth.user.photoURL,
      })
    );
    localStorage.setItem("authToken", userAuth.user.accessToken);
    toast.success(`Welcome back, ${userAuth.user.displayName}!`, {
      id: loader,
    });
    navigate(lastLocation);
  } catch (error) {
    toast.error("Invalid credentials. Try again!", {
      id: loader,
    });
  }
};

export const getUser = async (user, setUserData) => {
  try {
    const userDoc = doc(usersCollection, user?.uid);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      console.log("Could not retrieve user data");
    }
  } catch (error) {
    console.log(error);
  }
};

export const profileUpdate = async (
  userInfo,
  userData,
  currentUser,
  dispatch
) => {
  await setDoc(
    doc(db, "users", currentUser?.uid),
    {
      coverPic: userInfo?.coverPic
        ? userInfo?.coverPic
        : userData.coverPic ?? "",
      avatar: userInfo?.avatar ? userInfo?.avatar : userData.avatar,
      bio: userInfo?.bio ? userInfo?.bio : userData.bio ?? "",
      website: userInfo?.website ? userInfo?.website : userData.website ?? "",
    },
    { merge: true }
  );
  await updateProfile(currentUser, {
    photoURL: userData.avatar,
  });
  dispatch(updateDP(userData.avatar));
};

export const uploadImage = async (user, file) => {
  try {
    const path = `images/${user?.uid}/${file?.name}`;
    const imageRef = ref(storage, path);
    const response = file && (await uploadBytesResumable(imageRef, file));
    const pathName = response?.ref;
    const url = await getDownloadURL(pathName);
    return url;
  } catch (error) {
    toast.error("Could not upload image!");
    console.log(error.message);
  }
};

export const createPost = async (user, post) => {
  try {
    const loader = toast.loading("Posting...");
    const postDoc = await addDoc(allPostsCollection, {
      author: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      caption: post.caption,
      createdAt: new Date().toLocaleString(),
      imageURL: post.imageURL,
      likes: [],
      comments: [],
    });

    await setDoc(
      doc(allPostsCollection, postDoc.id),
      {
        postID: postDoc.id,
      },
      { merge: true }
    );
    toast.success("Post sent.", { id: loader });
  } catch (error) {
    toast.error("Post not sent. Try again!");
  }
};

export const editPost = async (post, updatePost) => {
  try {
    await setDoc(
      doc(allPostsCollection, post.postID),
      {
        caption: updatePost.caption,
        imageURL: updatePost.imageURL,
      },
      { merge: true }
    );
  } catch (error) {
    toast.error("Couldn't update post. Try again!");
  }
};

export const deletePost = async (post) => {
  try {
    await deleteDoc(doc(allPostsCollection, post.postID));
    toast.success("Post deleted");
  } catch (error) {
    toast.error("Couldn't delete post. Try again!");
  }
};

export const likePost = async (postID, user) => {
  try {
    await setDoc(
      doc(allPostsCollection, postID),
      {
        likes: arrayUnion({
          avatar: user.photoURL,
          displayName: user.displayName,
          userID: user.uid,
        }),
      },
      { merge: true }
    );
  } catch (error) {
    toast.error("Couldn't like post. Try again!");
  }
};

export const dislikePost = async (postID, user) => {
  try {
    await setDoc(
      doc(allPostsCollection, postID),
      {
        likes: arrayRemove({
          avatar: user.photoURL,
          displayName: user.displayName,
          userID: user.uid,
        }),
      },
      { merge: true }
    );
  } catch (error) {
    toast.error("Couldn't dislike post. Try again!");
  }
};

export const postComment = async ({ postID }, comment, user) => {
  try {
    await setDoc(
      doc(allPostsCollection, postID),
      {
        comments: arrayUnion({
          avatar: user.photoURL,
          displayName: user.displayName,
          userID: user.uid,
          comment: comment,
          date: date,
        }),
      },
      { merge: true }
    );
  } catch (error) {
    toast.error("Couldn't post the comment. Try again!");
  }
};

export const deleteComment = async (post, comment) => {
  try {
    await setDoc(
      doc(allPostsCollection, post.postID),
      {
        comments: arrayRemove(comment),
      },
      { merge: true }
    );
  } catch (error) {
    toast.error("Couldn't delete the comment. Try again!");
  }
};

export const followUser = async (currentUser, userToFollow) => {
  try {
    await setDoc(
      doc(collection(db, "users"), currentUser?.uid),
      {
        following: arrayUnion(userToFollow.userID),
      },
      { merge: true }
    );
    await setDoc(
      doc(collection(db, "users"), userToFollow.userID),
      {
        followers: arrayUnion(currentUser?.uid),
      },
      { merge: true }
    );
    toast.success(`You are now following ${userToFollow.displayName}`);
  } catch (error) {
    toast.error(`Couldn't follow ${userToFollow.displayName}. Try again!`);
    console.log(error);
  }
};

export const unfollowUser = async (currentUser, userToUnfollow) => {
  try {
    await setDoc(
      doc(collection(db, "users"), currentUser?.uid),
      {
        following: arrayRemove(userToUnfollow?.userID),
      },
      { merge: true }
    );

    await setDoc(
      doc(collection(db, "users"), userToUnfollow?.userID),
      {
        followers: arrayRemove(currentUser?.uid),
      },
      { merge: true }
    );
    toast.success(`Unfollowed ${userToUnfollow?.displayName}`);
  } catch (error) {
    toast.error(`Couldn't unfollow ${userToUnfollow?.displayName}. Try again!`);
    console.log(error);
  }
};

export const archivePost = async (post, user) => {
  try {
    await setDoc(
      doc(collection(db, "users"), user?.uid),
      {
        archives: arrayUnion(post),
      },
      { merge: true }
    );
    await deleteDoc(doc(allPostsCollection, post.postID));
    toast.success("Post archived");
  } catch (error) {
    toast.error("Couldn't archive post. Try again!");
  }
};

export const unarchivePost = async (post, user) => {
  try {
    await setDoc(
      doc(collection(db, "users"), user?.uid),
      {
        archives: arrayRemove(post),
      },
      { merge: true }
    );
    await setDoc(doc(allPostsCollection, post.postID), post, { merge: true });
    toast.success("Post unarchived");
  } catch (error) {
    toast.error("Couldn't unarchive post. Try again!");
  }
};

export const bookmarkPost = async (post, user) => {
  try {
    await setDoc(
      doc(collection(db, "users"), user?.uid),
      {
        bookmarks: arrayUnion(post),
      },
      { merge: true }
    );
    toast.success("Post bookmarked");
  } catch (error) {
    toast.error("Couldn't bookmark post. Try again!");
  }
};

export const undoBookmarkPost = async (post, user) => {
  try {
    await setDoc(
      doc(collection(db, "users"), user?.uid),
      {
        bookmarks: arrayRemove(post),
      },
      { merge: true }
    );
    toast.success("Removed from bookmarks");
  } catch (error) {
    toast.error("Couldn't remove from bookmarks. Try again!");
  }
};
