import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CheckList, Data, Item } from '../types';

// Simple ID generator compatible with Hermes
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface StoreState extends Data {
  addList: (title: string) => void;
  updateList: (slug: string, title: string) => void;
  deleteList: (slug: string) => void;
  addItem: (listSlug: string, message: string) => void;
  updateItem: (listSlug: string, itemId: string, updates: Partial<Item>) => void;
  deleteItem: (listSlug: string, itemId: string) => void;
  importData: (data: Data) => void;
  exportData: () => Data;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      lists: [],

      addList: (title: string) => {
        const slug = title.toLowerCase().replace(/\s+/g, '-');
        const newList: CheckList = {
          slug,
          title,
          items: [],
          created_at: new Date(),
        };
        set((state) => ({
          lists: [...state.lists, newList].sort(
            (a, b) => b.created_at.getTime() - a.created_at.getTime()
          ),
        }));
      },

      updateList: (slug: string, title: string) => {
        set((state) => ({
          lists: state.lists.map((list) => (list.slug === slug ? { ...list, title } : list)),
        }));
      },

      deleteList: (slug: string) => {
        set((state) => ({
          lists: state.lists.filter((list) => list.slug !== slug),
        }));
      },

      addItem: (listSlug: string, message: string) => {
        const newItem: Item = {
          id: generateId(),
          message,
          done: false,
          created_at: new Date(),
        };
        set((state) => ({
          lists: state.lists.map((list) =>
            list.slug === listSlug
              ? {
                  ...list,
                  items: [...list.items, newItem].sort(
                    (a, b) => b.created_at.getTime() - a.created_at.getTime()
                  ),
                }
              : list
          ),
        }));
      },

      updateItem: (listSlug: string, itemId: string, updates: Partial<Item>) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.slug === listSlug
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                }
              : list
          ),
        }));
      },

      deleteItem: (listSlug: string, itemId: string) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.slug === listSlug
              ? {
                  ...list,
                  items: list.items.filter((item) => item.id !== itemId),
                }
              : list
          ),
        }));
      },

      importData: (data: Data) => {
        set({ lists: data.lists });
      },

      exportData: () => {
        return { lists: get().lists };
      },
    }),
    {
      name: 'task-list-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
