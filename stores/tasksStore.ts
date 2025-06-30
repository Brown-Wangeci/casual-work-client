import { create } from 'zustand';
import api from '@/lib/axios';
import { Task, TaskApplication } from '@/constants/Types';

interface TasksState {
  posted: Task[];
  assigned: Task[];
  applications: TaskApplication[];
  loading: boolean;
  error: string | null;
  fetchUserTasks: () => Promise<void>;
  updateTask: (updatedTask: Task) => void;
  updateTaskApplication: (updatedApplication: TaskApplication) => void;
  addCreatedTask: (newTask: Task) => void;
  addTaskApplication: (newApplication: TaskApplication) => void;
  getCreatedTaskById: (id: string) => Task | undefined;
  clearTasks: () => void;
  clearApplications: () => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  posted: [],
  assigned: [],
  applications: [],
  loading: false,
  error: null,

  fetchUserTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('user/tasks');
      console.log('Fetched user tasks:', response.data.tasks);
      set({
        posted: response.data.tasks.posted ?? [],
        assigned: response.data.tasks.assigned ?? [],
        applications: response.data.tasks.applied ?? [],
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
    })),

  addCreatedTask: (newTask: Task) =>
    set((state) => {
        const exists = state.posted.some((task) => task.id === newTask.id);
        if (exists) return {}; // Skip if duplicate
        return {
        posted: [newTask, ...state.posted],
        };
    }),

  addTaskApplication: (newApplication: TaskApplication) =>
    set((state) => {
      const exists = state.applications.some((application) => application.id === newApplication.id);
      if (exists) return {}; // Skip if duplicate
      return {
        applications: [newApplication, ...state.applications],
      };
    }),

  updateTaskApplication: (updatedApplication: TaskApplication) =>
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === updatedApplication.id
          ? { ...application, ...updatedApplication }
          : application
      ),
    })),

  getCreatedTaskById: (id: string): Task | undefined => {
    return useTasksStore.getState().posted.find((task: Task) => task.id === id);
  },

  clearTasks: () =>
    set({
      posted: [],
      assigned: [],
      loading: false,
      error: null,
    }),

  clearApplications: () =>
    set({
      applications: [],
      }),
}));
