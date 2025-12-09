import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNotes } from '@/context/NotesContext';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, Trash2 } from 'lucide-react-native';
import { Note } from '@/types/note';

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams();
  const { notes, updateNote, deleteNote } = useNotes();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const noteId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : null;
    if (noteId) {
      const foundNote = notes.find(n => n.id === noteId);
      if (foundNote) {
        setNote(foundNote);
        setTitle(foundNote.title);
        setContent(foundNote.content);
      }
    }
    setLoading(false);
  }, [id, notes]);

  const handleSave = async () => {
    if (!note) return;

    if (!title.trim() && !content.trim()) {
      setError('Please enter a title or content');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await updateNote(note.id, title || 'Untitled', content);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note) return;

    try {
      setDeleting(true);
      await deleteNote(note.id);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !note) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
            disabled={saving || deleting}>
            <ArrowLeft color={theme.colors.primary} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>Edit Note</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.headerButton}
              disabled={saving || deleting}>
              {deleting ? (
                <ActivityIndicator color={theme.colors.error} size="small" />
              ) : (
                <Trash2 color={theme.colors.error} size={24} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.headerButton, styles.saveButton, { backgroundColor: theme.colors.primary }]}
              disabled={saving || deleting}
              activeOpacity={0.7}>
              {saving ? (
                <ActivityIndicator color={theme.colors.onPrimary} size="small" />
              ) : (
                <Check color={theme.colors.onPrimary} size={24} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
            <Text style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>{error}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Title"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={title}
            onChangeText={setTitle}
            style={[styles.titleInput, { color: theme.colors.onBackground }]}
            editable={!saving && !deleting}
          />
          <TextInput
            placeholder="Note content..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={content}
            onChangeText={setContent}
            style={[styles.contentInput, { color: theme.colors.onBackground }]}
            multiline
            editable={!saving && !deleting}
            scrollEnabled
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    borderRadius: 22,
  },
  inputContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    padding: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    padding: 8,
    textAlignVertical: 'top',
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
