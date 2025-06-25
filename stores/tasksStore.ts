import { create } from 'zustand';
import api from '@/lib/axios';
import { Task } from '@/constants/Types';

interface TasksState {
  posted: Task[];
  assigned: Task[];
  appliedTo: Task[];
  loading: boolean;
  error: string | null;
  fetchUserTasks: () => Promise<void>;
  updateTask: (updatedTask: Task) => void;
  addCreatedTask: (newTask: Task) => void;
  getCreatedTaskById: (id: string) => Task | undefined;
  clearTasks: () => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  posted: [],
  assigned: [],
  appliedTo: [],
  loading: false,
  error: null,

  fetchUserTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('user/tasks');
      set({
        posted: response.data.tasks.posted ?? [],
        assigned: response.data.tasks.assigned ?? [],
        appliedTo: response.data.tasks.applied ?? [],
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load tasks',
        loading: false,
      });
    }
  },

  updateTask: (updatedTask: Task) =>
    set((state) => ({
      posted: state.posted.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      ),
      assigned: state.assigned.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      ),
      appliedTo: state.appliedTo.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      ),
    })),

  addCreatedTask: (newTask: Task) =>
    set((state) => {
        const exists = state.posted.some((task) => task.id === newTask.id);
        if (exists) return {}; // Skip if duplicate
        return {
        posted: [newTask, ...state.posted],
        };
    }),

  getCreatedTaskById: (id: string): Task | undefined => {
    return useTasksStore.getState().posted.find((task: Task) => task.id === id);
  },

  clearTasks: () =>
    set({
      posted: [],
      assigned: [],
      appliedTo: [],
      loading: false,
      error: null,
    }),
}));
