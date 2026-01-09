import { MapPin } from 'lucide-react';

export default function PostLocation({ post }) {
  return (
    <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
      <span>{post.category}</span>
      {post.location && (
        <div className="flex items-center gap-1">
          <MapPin size={12} />
          <span>{post.location}</span>
        </div>
      )}
    </div>
  );
}