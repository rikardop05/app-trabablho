import { useState } from "react";
import { loadPosts } from "../utils/storage";
import PostCard from "../components/PostCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      try {
        const allPosts = loadPosts() || [];
        const filtered = allPosts.filter(p =>
          p && p.caption && p.caption.toLowerCase().includes(value.toLowerCase()) ||
          p && p.user && p.user.name && p.user.name.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
      } catch (error) {
        console.error("Error searching posts:", error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20 md:max-w-4xl md:mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pesquisar</h2>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Pesquise por posts, locais ou usuários"
        className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
      />
      <div>
        {results.length > 0 ? (
          results.map(p => (
            <PostCard
              key={p.id}
              post={p}
              onLike={() => {}}
              onAddComment={() => {}}
            />
          ))
        ) : query ? (
          <p>No results found.</p>
        ) : (
          <p>Entre com a pesquisa.</p>
        )}
      </div>
    </div>
  );
}