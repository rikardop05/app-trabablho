import { useState, useEffect } from "react";
import { loadPosts, savePosts } from "../utils/storage";
import PostCard from "./PostCard";
import { Search, X } from "lucide-react";

/**
 * SearchModal component for searching posts in a modal overlay.
 */
export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const posts = loadPosts() || [];
    setAllPosts(posts);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      const filtered = allPosts.filter(p =>
        p.caption.toLowerCase().includes(value.toLowerCase()) ||
        p.user.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const toggleLike = (postId) => {
    setResults(prev => {
      const next = prev.map(p =>
        String(p.id) === String(postId) ? { ...p, likes: (p.likes ?? 0) + 1 } : p
      );
      const updatedAll = allPosts.map(p =>
        String(p.id) === String(postId) ? { ...p, likes: (p.likes ?? 0) + 1 } : p
      );
      setAllPosts(updatedAll);
      savePosts(updatedAll);
      return next;
    });
  };

  const addComment = (postId, comment) => {
    setResults(prev => {
      const next = prev.map(p =>
        String(p.id) === String(postId)
          ? { ...p, comments: [...(p.comments || []), comment] }
          : p
      );
      const updatedAll = allPosts.map(p =>
        String(p.id) === String(postId)
          ? { ...p, comments: [...(p.comments || []), comment] }
          : p
      );
      setAllPosts(updatedAll);
      savePosts(updatedAll);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-black dark:text-white">Buscar</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Buscar posts ou usuários..."
              className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              results.map(p => (
                <PostCard
                  key={p.id}
                  post={p}
                  onLike={() => toggleLike(p.id)}
                  onAddComment={addComment}
                />
              ))
            ) : query ? (
              <p className="text-gray-500 dark:text-gray-400">Nenhum resultado encontrado.</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Digite um termo de busca.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}