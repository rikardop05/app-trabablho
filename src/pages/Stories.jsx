import { useParams, useNavigate } from "react-router-dom";
import { loadPosts, savePosts } from "../utils/storage";
import PostCard from "../components/PostCard";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

/**
 * Stories page component for displaying user posts or placeholder image.
 */
export default function Stories() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = loadPosts() || [];
    const userPosts = allPosts.filter(p => String(p.user.id) === String(userId));
    setPosts(userPosts);
  }, [userId]);

  const toggleLike = (postId) => {
    setPosts(prev => {
      const next = prev.map(p =>
        String(p.id) === String(postId) ? { ...p, likes: (p.likes ?? 0) + 1 } : p
      );
      // Update global posts
      const allPosts = loadPosts() || [];
      const updatedAll = allPosts.map(p =>
        String(p.id) === String(postId) ? { ...p, likes: (p.likes ?? 0) + 1 } : p
      );
      savePosts(updatedAll);
      return next;
    });
  };

  const addComment = (postId, comment) => {
    setPosts(prev => {
      const next = prev.map(p =>
        String(p.id) === String(postId)
          ? { ...p, comments: [...(p.comments || []), comment] }
          : p
      );
      // Update global posts
      const allPosts = loadPosts() || [];
      const updatedAll = allPosts.map(p =>
        String(p.id) === String(postId)
          ? { ...p, comments: [...(p.comments || []), comment] }
          : p
      );
      savePosts(updatedAll);
      return next;
    });
  };

  const isPlaceholder = userId === "1" || userId === "2" || userId === "3";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2"
        title="Voltar"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Stories</h2>
      {posts.length > 0 ? (
        posts.map(p => (
          <PostCard
            key={p.id}
            post={p}
            onLike={() => toggleLike(p.id)}
            onAddComment={addComment}
          />
        ))
      ) : isPlaceholder ? (
        <div className="text-center" data-view="story">
          <img
            src={`https://picsum.photos/600/900?random=${userId}`}
            alt="Placeholder story"
            className="max-w-full h-auto shadow-lg mx-auto w-[600px] h-[900px]"
            data-view="story"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Esta é uma história de exemplo.</p>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Nenhuma postagem para este usuário.</p>
      )}
    </div>
  );
}