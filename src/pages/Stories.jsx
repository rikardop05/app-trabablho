import { useParams, useNavigate } from "react-router-dom";
import { loadUsers, loadPosts, savePosts } from "../utils/storage";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import PostCard from "../components/PostCard";

export default function Stories() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // usuário
    const users = loadUsers() || [];
    const resolvedUser = users.find(
      u => String(u.id) === String(userId)
    );

    setUser(resolvedUser || null);

    // posts DO USUÁRIO
    if (resolvedUser) {
      const allPosts = loadPosts() || [];
      const filteredPosts = allPosts.filter(
        post => String(post.user?.id) === String(resolvedUser.id)
      );
      setUserPosts(filteredPosts);
    } else {
      setUserPosts([]);
    }
  }, [userId]);

  const toggleLike = (postId) => {
    setUserPosts(prev =>
      prev.map(p =>
        String(p.id) === String(postId)
          ? { ...p, likes: (p.likes ?? 0) + 1 }
          : p
      )
    );

    const allPosts = loadPosts() || [];
    const updatedAll = allPosts.map(p =>
      String(p.id) === String(postId)
        ? { ...p, likes: (p.likes ?? 0) + 1 }
        : p
    );
    savePosts(updatedAll);
  };

  const addComment = (postId, comment) => {
    setUserPosts(prev =>
      prev.map(p =>
        String(p.id) === String(postId)
          ? { ...p, comments: [...(p.comments || []), comment] }
          : p
      )
    );

    const allPosts = loadPosts() || [];
    const updatedAll = allPosts.map(p =>
      String(p.id) === String(postId)
        ? { ...p, comments: [...(p.comments || []), comment] }
        : p
    );
    savePosts(updatedAll);
  };

  // Usuário não encontrado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <p className="text-red-500">Usuário não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Stories de {user.name}
      </h2>

      {userPosts.length > 0 ? (
        userPosts.map(p => (
          <PostCard
            key={p.id}
            post={p}
            onLike={() => toggleLike(p.id)}
            onAddComment={addComment}
          />
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma postagem para este usuário.
        </p>
      )}
    </div>
  );
}
