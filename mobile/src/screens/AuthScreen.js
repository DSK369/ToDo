import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import API, { getErrorMessage } from '../services/api';
import { colors, radii, spacing } from '../theme';

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isRegisterMode = mode === 'register';

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim() || (isRegisterMode && !name.trim())) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      if (isRegisterMode) {
        await API.post('/auth/register', {
          name: name.trim(),
          email: email.trim(),
          password,
        });
      }

      const response = await API.post('/auth/login', {
        email: email.trim(),
        password,
      });

      await onAuthenticated(response.data.token);
      resetFields();
    } catch (submitError) {
      setError(
        getErrorMessage(
          submitError,
          isRegisterMode ? 'Unable to create your account.' : 'Unable to log in.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Mobile Productivity</Text>
          <Text style={styles.title}>Your to-do app, now on phone.</Text>
          <Text style={styles.subtitle}>
            Sign in to manage the same tasks from your existing backend.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.modeSwitch}>
            <Pressable
              onPress={() => switchMode('login')}
              style={[
                styles.modeButton,
                mode === 'login' && styles.modeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'login' && styles.modeButtonTextActive,
                ]}
              >
                Login
              </Text>
            </Pressable>

            <Pressable
              onPress={() => switchMode('register')}
              style={[
                styles.modeButton,
                mode === 'register' && styles.modeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'register' && styles.modeButtonTextActive,
                ]}
              >
                Register
              </Text>
            </Pressable>
          </View>

          {isRegisterMode ? (
            <TextInput
              autoCapitalize="words"
              editable={!submitting}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={name}
            />
          ) : null}

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!submitting}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={email}
          />

          <TextInput
            editable={!submitting}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={styles.input}
            value={password}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            disabled={submitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && !submitting && styles.submitButtonPressed,
              submitting && styles.submitButtonDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color={colors.surfaceStrong} />
            ) : (
              <Text style={styles.submitButtonText}>
                {isRegisterMode ? 'Create account' : 'Login'}
              </Text>
            )}
          </Pressable>

          <Text style={styles.helperText}>
            {isRegisterMode
              ? 'A new account will be created and signed in immediately.'
              : 'Use the same login details as your web app.'}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
  },
  modeSwitch: {
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    flexDirection: 'row',
    padding: 4,
  },
  modeButton: {
    alignItems: 'center',
    borderRadius: radii.pill,
    flex: 1,
    paddingVertical: 12,
  },
  modeButtonActive: {
    backgroundColor: colors.text,
  },
  modeButtonText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
  },
  modeButtonTextActive: {
    color: colors.surfaceStrong,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    minHeight: 54,
    justifyContent: 'center',
  },
  submitButtonPressed: {
    opacity: 0.92,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.surfaceStrong,
    fontSize: 16,
    fontWeight: '800',
  },
  helperText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
