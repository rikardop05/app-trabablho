import { useState } from "react";
import { X } from "lucide-react";

export default function BioEditModal({ user, onSave, onClose }) {
  const [bio, setBio] = useState(user.bio || "");

  const handleSave = () => {
    onSave(bio);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">Editar Bio</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={18} />
          </button>
        </div>
        <div className="mb-4">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Digite sua bio aqui...                                                                       "
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}