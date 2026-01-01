import { useState } from "react";

export default function CommentsModal({ post, onClose, onAddComment }) {
  const [text, setText] = useState("");

  if (!post) return null;

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const comment = { id: Date.now(), user: "Você", text: text.trim() };
    onAddComment(post.id, comment);
    setText("");
  }

  const comments = post.comments || [];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="bg-white w-full max-w-md rounded shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">Comentários</h3>
          <button type="button" onClick={onClose} className="text-gray-600">Fechar</button>
        </div>

        <div className="max-h-64 overflow-auto mb-3">
          {comments.length === 0 && <div className="text-sm text-gray-500">Nenhum comentário</div>}
          {comments.map(c => (
            <div key={c.id} className="border-b py-2">
              <div className="text-sm font-semibold">{c.user}</div>
              <div className="text-sm text-gray-700">{c.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="Escreva um comentário"
            aria-label="Escreva um comentário"
          />
          <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Enviar</button>
        </form>
      </div>
    </div>
  );
}