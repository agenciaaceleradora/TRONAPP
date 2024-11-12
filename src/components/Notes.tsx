import React, { useState, useEffect } from 'react';
import { Save, X, Calendar, Plus } from 'lucide-react';

interface Note {
  id: string;
  date: string;
  content: string;
  customDate?: string;
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('tradeNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tradeNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: newNote.trim(),
        customDate: customDate || undefined,
      };
      setNotes([...notes, note]);
      setNewNote('');
      setCustomDate('');
      setIsAddingNote(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <span className="text-xl">📝</span>}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Anotações</h3>
            <button
              onClick={() => setIsAddingNote(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-3 py-2 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Anotação
            </button>
          </div>
          
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
            {notes.map(note => (
              <div key={note.id} className="bg-gray-700 rounded-lg p-3 relative group">
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-gray-300 text-sm mb-2">{note.content}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {note.customDate || new Date(note.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {isAddingNote && (
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex gap-2 mb-3">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="bg-gray-600 border border-gray-500 rounded-lg p-2 text-white text-sm"
                />
              </div>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Digite sua anotação..."
                className="w-full bg-gray-600 border border-gray-500 rounded-lg p-2 text-white text-sm resize-none focus:ring-2 focus:ring-purple-500 mb-3"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingNote(false)}
                  className="text-gray-400 hover:text-gray-300 px-3 py-2 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={addNote}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}