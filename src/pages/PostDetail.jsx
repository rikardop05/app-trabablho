import { useParams, useNavigate } from "react-router-dom";
import { loadPosts, savePosts } from "../utils/storage";
import { getUserAvatar } from "../utils/imageUtils";
import { useState, useEffect } from "react";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import CommentsModal from "../components/CommentsModal";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const allPosts = loadPosts() || [];
    const foundPost = allPosts.find(p => String(p.id) === String(postId));
    setPost(foundPost);
  }, [postId]);

  const toggleLike = () => {
    if (!post) return;
    const updatedPost = { ...post, likes: (post.likes ?? 0) + 1 };
    setPost(updatedPost);
    
    const allPosts = loadPosts() || [];
    const updatedAll = allPosts.map(p =>
      String(p.id) === String(postId) ? updatedPost : p
    );
    savePosts(updatedAll);
  };

  const addComment = (comment) => {
    if (!post) return;
    const updatedPost = {
      ...post,
      comments: [...(post.comments || []), comment]
    };
    setPost(updatedPost);
    
    const allPosts = loadPosts() || [];
    const updatedAll = allPosts.map(p =>
      String(p.id) === String(postId) ? updatedPost : p
    );
    savePosts(updatedAll);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <p className="text-gray-500 dark:text-gray-400">Postagem não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <img
          src={post.image}
          alt={post.caption || "Post"}
          className="w-full h-64 object-cover"
        />

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img
                src={getUserAvatar(post.user)}
                alt={post.user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold dark:text-white">{post.user.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLike}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <Heart size={20} fill={post.likes > 0 ? "currentColor" : "none"} />
                <span>{post.likes || 0}</span>
              </button>
              <button
                onClick={() => setShowComments(true)}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <MessageCircle size={20} />
                <span>{post.comments?.length || 0}</span>
              </button>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">{post.caption}</p>

          {post.comments && post.comments.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2 dark:text-white">Comentários</h3>
              {post.comments.slice(0, 2).map((comment, index) => (
                <div key={index} className="flex items-start gap-2 mb-2">
                  <img
                    src={getUserAvatar({ id: comment.user || comment.id, avatar: null })}
                    alt="Comentário"
                    className="w-6 h-6 rounded-full mt-1"
                  />
                  <div>
                    <span className="font-medium text-sm dark:text-white">{comment.user || "Usuário"}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{comment.text}</p>
                  </div>
                </div>
              ))}
              {post.comments.length > 2 && (
                <button
                  onClick={() => setShowComments(true)}
                  className="text-sm text-blue-500 hover:text-blue-600 mt-2"
                >
                  Ver todos os {post.comments.length} comentários
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        comments={post.comments || []}
        onAddComment={addComment}
      />
    </div>
  );
}