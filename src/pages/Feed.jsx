import StoriesBar from "../components/StoriesBar"
import { useEffect, useState } from "react"
import { loadPosts } from "../utils/storage"
import PostCard from "../components/PostCard"

export default function Feed() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    setPosts(loadPosts())
    
    const handlePostsUpdate = () => {
      setPosts(loadPosts())
    }
    
    window.addEventListener('posts_updated', handlePostsUpdate)
    
    return () => {
      window.removeEventListener('posts_updated', handlePostsUpdate)
    }
  }, [])

  return (
    <div className="pb-24">
      {/* STORIES — fora do container com padding */}
      <div className="w-full overflow-x-hidden">
        <StoriesBar />
      </div>

      {/* FEED */}
      <div className="p-4 mt-6 space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
