import { setAllPosts } from "features/allPosts/allPostsSlice";
import { usersList } from "features/allUsers/usersSlice";
import {
  addBookmark,
  login,
  logout,
  setArchive,
  setFollowers,
  setFollowing,
} from "features/user/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "./firebase";

export const firebaseListeners = (dispatch) => {
  authChangeListener(dispatch);
  postsListener(dispatch);
  usersListener(dispatch);
};

const authChangeListener = (dispatch) => {
  try {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            photoURL: userAuth.photoURL,
          })
        );
      } else {
        dispatch(logout());
      }
    });
  } catch (error) {
    console.error(error.message);
  }
};

const usersListener = (dispatch) => {
  try {
    onSnapshot(collection(db, "users"), (snapshot) => {
      const allUsersList = snapshot.docs.map((doc) => doc.data());
      dispatch(usersList(allUsersList));
    });
  } catch (error) {
    console.error(error.message);
  }
};

const postsListener = (dispatch) => {
  try {
    const loader = toast.loading("Loading..");
    const q = query(collection(db, "allPosts"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const allPostsList = snapshot.docs.map((doc) => doc.data());
      dispatch(setAllPosts(allPostsList));
    });
    toast.dismiss(loader);
  } catch (error) {
    console.error(error.message);
  }
};

const followingListener = (dispatch, userID) => {
  try {
    onSnapshot(doc(db, "users", userID), (doc) => {
      const following = doc.data().following;
      dispatch(setFollowing(following));
    });
  } catch (error) {
    console.error(error.message);
  }
};

const followersListener = (dispatch, userID) => {
  try {
    onSnapshot(doc(db, "users", userID), (doc) => {
      const followers = doc.data().followers;
      dispatch(setFollowers(followers));
    });
  } catch (error) {
    console.error(error.message);
  }
};

const archivesListener = (dispatch, userID) => {
  try {
    onSnapshot(doc(db, "users", userID), (doc) => {
      const archives = doc.data().archives;
      dispatch(setArchive(archives));
    });
  } catch (error) {
    console.error(error.message);
  }
};

const bookmarksListener = (dispatch, userID) => {
  try {
    onSnapshot(doc(db, "users", userID), (doc) => {
      const bookmarks = doc.data().bookmarks;
      dispatch(addBookmark(bookmarks));
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const userDataListeners = (dispatch, userID) => {
  followingListener(dispatch, userID);
  followersListener(dispatch, userID);
  archivesListener(dispatch, userID);
  bookmarksListener(dispatch, userID);
};
