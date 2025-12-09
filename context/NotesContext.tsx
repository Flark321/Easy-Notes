import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note } from '@/types/note';
import { supabase } from '@/services/supabase';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  fetchNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setNotes([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setNotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (title: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const { data, error: insertError } = await supabase
        .from('notes')
        .insert([
          {
            title,
            content,
            user_id: user.id,
          },
        ])
        .select();

      if (insertError) throw insertError;

      if (data) {
        setNotes([data[0], ...notes]);
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add note');
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const { error: updateError } = await supabase
        .from('notes')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      setNotes(notes.map(note =>
        note.id === id
          ? { ...note, title, content, updated_at: new Date().toISOString() }
          : note
      ));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update note');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete note');
    }
  };

  useEffect(() => {
    fetchNotes();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchNotes();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <NotesContext.Provider value={{ notes, loading, error, addNote, updateNote, deleteNote, fetchNotes }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
