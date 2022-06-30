import { AiFillHome, AiFillCompass } from "react-icons/ai";
import { RiInboxArchiveFill } from "react-icons/ri";
import { BsFillBookmarkFill } from "react-icons/bs";
import avatar01 from "assets/avatar_01.webp";
import avatar02 from "assets/avatar_02.webp";
import avatar03 from "assets/avatar_03.webp";
import avatar04 from "assets/avatar_04.webp";
import cover01 from "assets/cover_01.webp";
import cover02 from "assets/cover_02.webp";
import cover03 from "assets/cover_03.webp";
import cover04 from "assets/cover_04.webp";

export const navLinks = [
  { pathTo: "/home", icon: <AiFillHome />, navPath: "Home" },
  { pathTo: "/explore", icon: <AiFillCompass />, navPath: "Explore" },
  { pathTo: "/bookmarks", icon: <BsFillBookmarkFill />, navPath: "Bookmarks" },
  { pathTo: "/archives", icon: <RiInboxArchiveFill />, navPath: "Archives" },
];

const avatars = [
  {
    avatar: avatar01,
    cover: cover01,
  },
  {
    avatar: avatar02,
    cover: cover02,
  },
  {
    avatar: avatar03,
    cover: cover03,
  },
  {
    avatar: avatar04,
    cover: cover04,
  },
];

export const defaultAvatar =
  avatars[Math.floor(Math.random() * avatars.length)];
