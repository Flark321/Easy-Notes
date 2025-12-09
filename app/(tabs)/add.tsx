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
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';

export default function AddNoteScreen() {
  const { addNote } = useNotes();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      setError('Please enter a title or content');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await addNote(title || 'Untitled', content);
      setTitle('');
      setContent('');
      router.push('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
            disabled={saving}>
            <ArrowLeft color={theme.colors.primary} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>New Note</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.headerButton, styles.saveButton, { backgroundColor: theme.colors.primary }]}
            disabled={saving}
            activeOpacity={0.7}>
            {saving ? (
              <ActivityIndicator color={theme.colors.onPrimary} size="small" />
            ) : (
              <Check color={theme.colors.onPrimary} size={24} />
            )}
          </TouchableOpacity>
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
            editable={!saving}
          />
          <TextInput
            placeholder="Start typing..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={content}
            onChangeText={setContent}
            style={[styles.contentInput, { color: theme.colors.onBackground }]}
            multiline
            editable={!saving}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
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
