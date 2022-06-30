import { TextEditor, Post } from "components/components";
import { Empty } from "pages/pages";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector((state) => state.user);
  const { allPosts } = useSelector((state) => state.allPosts);
  const [sortBy, setSortBy] = useState("Latest");
  const followingUsers = user?.following;

  const filteredPosts = allPosts?.filter(
    (post) => followingUsers?.includes(post.uid) || post.uid === user?.uid
  );

  const sortHandler = () => {
    switch (sortBy) {
      case "Latest":
        return [...filteredPosts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "Oldest":
        return [...filteredPosts].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "Trending":
        return [...filteredPosts].sort(
          (a, b) => b.likes?.length - a.likes?.length
        );
      default:
        return filteredPosts;
    }
  };

  const posts = sortHandler(filteredPosts);

  return (
    <div className="flex w-full flex-col sm:gap-2 md:gap-2 lg:mx-2">
      <TextEditor />
      {posts?.length > 0 && (
        <select
          className="w-fit self-center rounded-md py-1 px-3 focus:outline focus:outline-2 focus:outline-blue-400"
          onChange={(e) => setSortBy(e.target.value)}
          value={sortBy}
        >
          <option value="Latest">Latest</option>
          <option value="Oldest">Oldest</option>
          <option value="Trending">Trending</option>
        </select>
      )}

      <div className="sm:mb-16 md:mb-16">
        {posts?.length > 0 ? (
          <div className="flex flex-col ">
            {posts?.map((post) => (
              <Post post={post} key={post.postID} />
            ))}
          </div>
        ) : (
          <div className="flex h-1/2 items-center pt-24">
            <Empty />
          </div>
        )}
      </div>
    </div>
  );
}
