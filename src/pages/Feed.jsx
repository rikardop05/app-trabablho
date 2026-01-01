import StoriesBar from "../components/StoriesBar"
import { useEffect, useState } from "react"
import { loadPosts } from "../utils/storage"
import PostCard from "../components/PostCard"

export default function Feed() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    setPosts(loadPosts())
  }, [])

  return (
    <div className="p-4 pb-32">
      <StoriesBar />

      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
