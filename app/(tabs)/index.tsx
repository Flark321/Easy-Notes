import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNotes } from '@/context/NotesContext';
import { useTheme } from '@/context/ThemeContext';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { notes, loading, deleteNote } = useNotes();
  const { theme } = useTheme();
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await deleteNote(id);
    } catch (err) {
      console.error('Failed to delete note:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleNotePress = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const renderEmptyState = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.emptyTitle, { color: theme.colors.onBackground }]}>No Notes Yet</Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Create your first note to get started
      </Text>
    </View>
  );

  const renderNoteItem = ({ item }: { item: typeof notes[0] }) => (
    <TouchableOpacity
      onPress={() => handleNotePress(item.id)}
      style={[styles.noteCard, { backgroundColor: theme.colors.surface }]}
      activeOpacity={0.7}>
      <View style={styles.noteContent}>
        <Text style={[styles.noteTitle, { color: theme.colors.onSurface }]} numberOfLines={2}>
          {item.title || 'Untitled'}
        </Text>
        <Text
          style={[styles.notePreview, { color: theme.colors.onSurfaceVariant }]}
          numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={[styles.noteDate, { color: theme.colors.outlineVariant }]}>
          {formatDate(item.updated_at)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        disabled={deleting === item.id}
        style={styles.deleteButton}>
        {deleting === item.id ? (
          <ActivityIndicator color={theme.colors.error} size="small" />
        ) : (
          <Trash2 color={theme.colors.error} size={20} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {loading ? (
        <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : notes.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  noteContent: {
    flex: 1,
    marginRight: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  notePreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
