import { useState, useCallback, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Share,
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

import { useDataImportExport } from '../hooks/useDataImportExport';
import { useStore } from '../store/useStore';

export function HomeScreen() {
  const { handleExport, handleImport } = useDataImportExport();
  const [newTask, setNewTask] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  // Initialize lists if they don't exist
  useEffect(() => {
    const store = useStore.getState();
    if (!store.lists.find((list) => list.slug === 'tasks')) {
      store.addList('tasks');
    }
    if (!store.lists.find((list) => list.slug === 'completed')) {
      store.addList('completed');
    }
  }, []);

  // Get store actions
  const addItem = useStore((state) => state.addItem);
  // const updateItem = useStore((state) => state.updateItem);
  const deleteItem = useStore((state) => state.deleteItem);

  // Get store data
  const tasks = useStore((state) => state.lists.find((list) => list.slug === 'tasks')?.items || []);
  const completedTasks = useStore(
    (state) => state.lists.find((list) => list.slug === 'completed')?.items || []
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      if (!task.done) {
        addItem('completed', task.message);
        deleteItem('tasks', taskId);
      } else {
        addItem('tasks', task.message);
        deleteItem('completed', taskId);
      }
    },
    [tasks, addItem, deleteItem]
  );

  const handleAddTask = useCallback(() => {
    if (newTask.trim()) {
      addItem('tasks', newTask.trim());
      setNewTask('');
    }
  }, [newTask, addItem]);

  const handleMarkAllCompleted = useCallback(() => {
    tasks.forEach((task) => {
      if (!task.done) {
        addItem('completed', task.message);
        deleteItem('tasks', task.id);
      }
    });
  }, [tasks, addItem, deleteItem]);

  const handleClearCompleted = useCallback(() => {
    completedTasks.forEach((task) => {
      deleteItem('completed', task.id);
    });
  }, [completedTasks, deleteItem]);

  const handleExportPress = async () => {
    try {
      const data = handleExport();
      const jsonString = JSON.stringify(data, null, 2);

      // Create a temporary file
      const fileUri = `${FileSystem.cacheDirectory}tasks-${new Date().toISOString().split('T')[0]}.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      // Share the file
      await Share.share({
        url: fileUri,
        title: 'Tasks Export',
        message: 'Here is your tasks export file',
      });

      Alert.alert('Success', 'Tasks exported successfully');
    } catch (error) {
      console.error('Error exporting file:', error);
      Alert.alert('Error', 'Failed to export tasks');
    }
  };

  const handleImportPress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (!result.canceled && result.assets[0]) {
        const response = await fetch(result.assets[0].uri);
        const jsonString = await response.text();
        const data = JSON.parse(jsonString);
        handleImport(data);
        Alert.alert('Success', 'Tasks imported successfully');
      }
    } catch (error) {
      console.error('Error importing file:', error);
      Alert.alert('Error', "Failed to import file. Please make sure it's a valid JSON file.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Tasks zinli</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={handleImportPress} className="rounded-full bg-green-600 p-2">
              <Ionicons name="cloud-download" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExportPress} className="rounded-full bg-blue-600 p-2">
              <Ionicons name="cloud-upload" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Sort and Completed Row */}
        <View className="flex-row items-center justify-between px-4 pb-2">
          <TouchableOpacity className="flex-row items-center">
            <Text className="mr-1 text-gray-500 dark:text-gray-300">Sorted by Due date</Text>
            <Ionicons name="chevron-down" size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center" onPress={handleMarkAllCompleted}>
            <Text className="mr-1 text-gray-500 dark:text-gray-300">Completed</Text>
            <Ionicons
              name={showCompleted ? 'checkbox-outline' : 'square-outline'}
              size={18}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
        {/* Task List */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {!showCompleted &&
            tasks
              .filter((t) => !t.done)
              .map((task) => (
                <TouchableOpacity
                  key={task.id}
                  className="mb-3 flex-row items-center rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  onPress={() => toggleTask(task.id)}
                  activeOpacity={0.8}>
                  <Ionicons
                    name={task.done ? 'checkbox-outline' : 'ellipse-outline'}
                    size={22}
                    color={task.done ? '#2563EB' : '#9CA3AF'}
                    className="mr-3"
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-medium text-gray-900 dark:text-white">
                      {task.message}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          {/* Completed Section */}
          <View className="mt-2">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm text-gray-500 dark:text-gray-300">
                Completed {completedTasks.length} tasks
              </Text>
              <TouchableOpacity
                onPress={handleClearCompleted}
                className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">
                <Text className="text-xs text-blue-600 dark:text-blue-400">Clear all</Text>
              </TouchableOpacity>
            </View>
            {completedTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                className="mb-2 flex-row items-center rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800"
                onPress={() => toggleTask(task.id)}
                activeOpacity={0.8}>
                <Ionicons name="checkbox-outline" size={20} color="#2563EB" className="mr-3" />
                <Text className="flex-1 text-base text-gray-400 line-through dark:text-gray-500">
                  {task.message}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* New Task Input */}
        <View className="flex-row items-center border-t border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <TextInput
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-gray-900 dark:bg-gray-800 dark:text-white"
            placeholder="New task..."
            placeholderTextColor="#9CA3AF"
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
          />
          <TouchableOpacity
            className="ml-2 rounded-full bg-blue-600 p-3"
            onPress={handleAddTask}
            disabled={!newTask.trim()}>
            <Ionicons name="arrow-up" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
