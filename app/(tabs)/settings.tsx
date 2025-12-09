import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, LogOut, LogIn } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { useRouter } from 'expo-router';
import { User } from '@supabase/supabase-js';

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (err) {
      console.error('Failed to check user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            setSigning(true);
            await supabase.auth.signOut();
            router.replace('/auth');
          } catch (err) {
            Alert.alert('Error', 'Failed to sign out');
          } finally {
            setSigning(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSignIn = () => {
    router.push('/auth');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Appearance
        </Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
          onPress={toggleTheme}
          activeOpacity={0.7}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              {isDarkMode ? (
                <Moon color={theme.colors.primary} size={24} />
              ) : (
                <Sun color={theme.colors.primary} size={24} />
              )}
            </View>
            <View style={styles.settingText}>
              <Text style={[styles.settingName, { color: theme.colors.onSurface }]}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                Tap to toggle theme
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text
          style={[styles.sectionTitle, { color: theme.colors.onBackground, marginTop: 32 }]}>
          Account
        </Text>

        {loading ? (
          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : user ? (
          <>
            <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.settingContent}>
                <View style={styles.settingText}>
                  <Text style={[styles.settingName, { color: theme.colors.onSurface }]}>
                    {user.email}
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Signed in
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.dangerButton, { backgroundColor: theme.colors.errorContainer }]}
              onPress={handleSignOut}
              disabled={signing}
              activeOpacity={0.7}>
              {signing ? (
                <ActivityIndicator color={theme.colors.onErrorContainer} />
              ) : (
                <>
                  <LogOut color={theme.colors.onErrorContainer} size={20} />
                  <Text style={[styles.dangerButtonText, { color: theme.colors.onErrorContainer }]}>
                    Sign Out
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSignIn}
            activeOpacity={0.7}>
            <LogIn color={theme.colors.onPrimary} size={20} />
            <Text style={[styles.primaryButtonText, { color: theme.colors.onPrimary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Notes App v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingText: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
});
