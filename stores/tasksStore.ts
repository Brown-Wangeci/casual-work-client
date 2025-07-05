import { create } from 'zustand';
import api from '@/lib/utils/axios';
import { Task, TaskApplication } from '@/constants/Types';
import { showToast } from '@/lib/utils/showToast';
import { extractErrorMessage, logError } from '@/lib/utils';

interface TasksState {
  posted: Task[];
  assigned: Task[];
  applications: TaskApplication[];
  loading: boolean;
  isCancelling: boolean;
  error: string | null;
  fetchUserTasks: () => Promise<void>;
  updateTask: (updatedTask: Task) => void;
  updateTaskApplication: (updatedApplication: TaskApplication) => void;
  addCreatedTask: (newTask: Task) => void;
  addTaskApplication: (newApplication: TaskApplication) => void;
  getApplicationByTaskId: (taskId: string) => TaskApplication | undefined;
  hasUserApplied: (taskId: string, userId: string) => boolean;
  getApplicationStatus: (taskId: string, userId: string) => 'accepted' | 'denied' | 'pending' | null;
  getCreatedTaskById: (id: string) => Task | undefined;
  getAssignedTaskById: (id: string) => Task | undefined;
  getTaskById: (id: string) => Task | undefined;
  cancelTask: (taskId: string, onSuccess?: () => void) => Promise<void>;
  clearTasks: () => void;
  clearApplications: () => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  posted: [],
  assigned: [],
  applications: [],
  isCancelling: false,
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

  getApplicationByTaskId: (taskId: string): TaskApplication | undefined => {
    return useTasksStore.getState().applications.find(
      (application) => application.task?.id === taskId
    );
  },

  hasUserApplied: (taskId: string, userId: string): boolean => {
    return !!useTasksStore.getState().applications.find(
      (application) =>
        application.task?.id === taskId && application.user?.id === userId
    );
  },

  getApplicationStatus: (taskId: string, userId: string): 'accepted' | 'denied' | 'pending' | null => {
    const app = useTasksStore.getState().applications.find(
      (application) =>
        application.task?.id === taskId && application.user?.id === userId
    );
    if (!app) return null;
    if (app.status === 'ACCEPTED') return 'accepted';
    if (app.status === 'DENIED') return 'denied';
    return 'pending';
  },


  getCreatedTaskById: (id: string): Task | undefined => {
    return useTasksStore.getState().posted.find((task: Task) => task.id === id);
  },

  getAssignedTaskById: (id: string): Task | undefined => {
    return useTasksStore.getState().assigned.find((task: Task) => task.id === id);
  },

  getTaskById: (id: string): Task | undefined => {
    const task = useTasksStore.getState().getAssignedTaskById(id) || useTasksStore.getState().getCreatedTaskById(id);
    if (!task) {
      console.warn(`Task with ID ${id} not found in either posted or assigned tasks.`);
      return undefined;
    }
    return task;
  },

  cancelTask: async (taskId: string, onSuccess?: () => void) => {
    set({ isCancelling: true});
    try {
      const response = await api.patch(`/tasks/${taskId}/cancel`);
      if (response.status === 200 || response.data?.success) {
        // Update the store
        useTasksStore.getState().updateTask(response.data.task);
        showToast('success', 'Task Cancelled', response.data.message || 'Task has been successfully cancelled.');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        showToast('error', 'Failed to Cancel Task', response.data.message || 'Unexpected server response.');
      }
    } catch (error: any) {
      logError(error, 'cancelTask');
      const message = extractErrorMessage(error);
      showToast('error', 'Failed to Cancel Task', message);
    } finally {
      set({ isCancelling: false });
    }
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
