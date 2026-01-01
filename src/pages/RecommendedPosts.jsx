import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initialPosts } from "../data/posts";
import { loadPosts, savePosts, loadUser } from "../utils/storage";
import { ArrowLeft } from "lucide-react";
import PostCard from "../components/PostCard";

export default function RecommendedPosts() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = loadUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    try {
      const stored = loadPosts();
      if (stored && stored.length > 0) {
        setPosts(stored);
      } else {
        setPosts(initialPosts);
        savePosts(initialPosts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts(initialPosts);
    }
  }, []);

  useEffect(() => {
    function onPostsUpdated() {
      const stored = loadPosts();
      if (stored) setPosts(stored);
    }
    window.addEventListener("trabalho_final_posts_updated", onPostsUpdated);
    return () => window.removeEventListener("trabalho_final_posts_updated", onPostsUpdated);
  }, []);

  function handleLike(postId) {
    const updatedPosts = posts.map(postItem =>
      String(postItem.id) === String(postId) ? { ...postItem, likes: (postItem.likes ?? 0) + 1 } : postItem
    );
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  }

  function handleAddComment(postId, comment) {
    const updatedPosts = posts.map(postItem =>
      String(postItem.id) === String(postId)
        ? { ...postItem, comments: [...(postItem.comments || []), comment] }
        : postItem
    );
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2"
          title="Voltar"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Posts Recomendados</h2>
      </div>

      <div className="p-4 pb-20">
        <div className="space-y-4">
          {posts.slice(0, 5).map(p => (
            <PostCard
              key={p.id}
              post={p}
              onLike={() => handleLike(p.id)}
              onAddComment={handleAddComment}
              user={user}
            />
          ))}
        </div>
      </div>
    </div>
  );
}