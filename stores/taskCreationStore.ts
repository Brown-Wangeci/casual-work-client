import { create } from 'zustand';

type Task = {
  title: string;
  description: string;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  offer: number | null;
};

type TaskCreationStore = {
  task: Task;
  setField: <K extends keyof Task>(field: K, value: Task[K]) => void;
  setLocation: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  resetTask: () => void;
};

export const useTaskCreationStore = create<TaskCreationStore>((set) => ({
  task: {
    title: '',
    description: '',
    category: '',
    location: '',
    latitude: null,
    longitude: null,
    offer: null,
  },
  setField: (field, value) =>
    set((state) => ({
      task: {
        ...state.task,
        [field]: value,
      },
    })),
  setLocation: ({ address, latitude, longitude }) =>
    set((state) => ({
      task: {
        ...state.task,
        location: address,
        latitude,
        longitude,
      },
    })),
  resetTask: () =>
    set(() => ({
      task: {
        title: '',
        description: '',
        category: '',
        location: '',
        latitude: null,
        longitude: null,
        offer: null,
      },
    })),
}));
