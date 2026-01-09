import { useState } from "react";
import { Heart } from "lucide-react";

/**
 * botão de curtir que tem a intenção de contar impressões e não exatamente curtida, pois se trata de tragédias ambientais.
 * Likes e contagem de curtidas.
 */
export default function LikeButton({ initial = 0 }) {
  const [likes, setLikes] = useState(initial);
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
      className={`flex items-center gap-1 px-3 py-1 rounded transition-all duration-200 hover:scale-110 ${liked ? "bg-red-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"}`}
      title={liked ? "Descurtir" : "Curtir"}
    >
      <Heart size={20} className={liked ? "fill-current animate-pulse" : ""} />
      {likes}
    </button>
  );
}