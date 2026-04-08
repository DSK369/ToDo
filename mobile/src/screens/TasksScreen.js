import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import API, { getErrorMessage } from '../services/api';
import { colors, radii, spacing } from '../theme';

export default function TasksScreen({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const requestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTasks = async ({ silent = false } = {}) => {
    try {
      setError('');
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await API.get('/tasks', requestConfig);
      setTasks(response.data);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError, 'Unable to load tasks.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please add a task title before saving.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await API.post(
        '/tasks',
        {
          title: title.trim(),
          description: description.trim(),
        },
        requestConfig
      );

      setTitle('');
      setDescription('');
      await fetchTasks();
    } catch (createError) {
      setError(getErrorMessage(createError, 'Unable to create task.'));
    } finally {
      setSaving(false);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      setError('');

      await API.put(
        `/tasks/${task._id}`,
        {
          status: task.status === 'todo' ? 'done' : 'todo',
        },
        requestConfig
      );

      await fetchTasks({ silent: true });
    } catch (updateError) {
      setError(getErrorMessage(updateError, 'Unable to update task.'));
    }
  };

  const deleteTask = (taskId) => {
    Alert.alert('Delete task', 'This task will be removed permanently.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setError('');
            await API.delete(`/tasks/${taskId}`, requestConfig);
            await fetchTasks({ silent: true });
          } catch (deleteError) {
            setError(getErrorMessage(deleteError, 'Unable to delete task.'));
          }
        },
      },
    ]);
  };

  const renderTask = ({ item }) => {
    const done = item.status === 'done';
    const priorityLabel = item.priority || 'medium';

    return (
      <View style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleBlock}>
            <Text style={[styles.taskTitle, done && styles.taskTitleDone]}>
              {item.title}
            </Text>
            <Text style={styles.taskDescription}>
              {item.description || 'No description added yet.'}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              done ? styles.statusDone : styles.statusTodo,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                done ? styles.statusDoneText : styles.statusTodoText,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Priority: {priorityLabel}</Text>
        </View>

        <View style={styles.taskActions}>
          <Pressable
            onPress={() => toggleTaskStatus(item)}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              Mark as {done ? 'Todo' : 'Done'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => deleteTask(item._id)}
            style={({ pressed }) => [
              styles.dangerButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.dangerButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const listHeader = (
    <View style={styles.headerArea}>
      <View style={styles.hero}>
        <View>
          <Text style={styles.eyebrow}>Task Console</Text>
          <Text style={styles.title}>Keep your list moving.</Text>
          <Text style={styles.subtitle}>
            Add, complete, and remove tasks from your phone.
          </Text>
        </View>

        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Create task</Text>
        <TextInput
          editable={!saving}
          onChangeText={setTitle}
          placeholder="Task title"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={title}
        />
        <TextInput
          editable={!saving}
          multiline
          numberOfLines={3}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor={colors.muted}
          style={[styles.input, styles.textArea]}
          value={description}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable
          disabled={saving}
          onPress={createTask}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && !saving && styles.buttonPressed,
            saving && styles.primaryButtonDisabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator color={colors.surfaceStrong} />
          ) : (
            <Text style={styles.primaryButtonText}>Add Task</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your tasks</Text>
        <Text style={styles.sectionCount}>{tasks.length}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={tasks}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No tasks yet</Text>
              <Text style={styles.emptyText}>
                Create your first task above and it will appear here.
              </Text>
            </View>
          }
          ListHeaderComponent={listHeader}
          onRefresh={() => fetchTasks({ silent: true })}
          refreshing={refreshing}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  headerArea: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  hero: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
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
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  logoutButton: {
    backgroundColor: colors.text,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  logoutButtonText: {
    color: colors.surfaceStrong,
    fontSize: 14,
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
  },
  formTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
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
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: colors.surfaceStrong,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionCount: {
    backgroundColor: colors.accentMuted,
    borderRadius: radii.pill,
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
    minWidth: 34,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  taskHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  taskTitleBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  taskTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  taskTitleDone: {
    opacity: 0.75,
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  statusBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDone: {
    backgroundColor: colors.successMuted,
  },
  statusTodo: {
    backgroundColor: colors.warningMuted,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statusDoneText: {
    color: colors.success,
  },
  statusTodoText: {
    color: colors.warning,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  taskActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentMuted,
    borderRadius: radii.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
  },
  dangerButton: {
    alignItems: 'center',
    backgroundColor: colors.dangerMuted,
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  dangerButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginTop: spacing.xs,
    padding: spacing.xl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
