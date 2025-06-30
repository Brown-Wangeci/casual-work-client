import { create } from 'zustand'
import { Task } from '@/constants/Types'

type TaskFeedStore = {
    tasks: Task[] | null
    setTasks: (tasks: Task[]) => void
    getTaskById: (id: string) => Task | undefined
    updateTask: (updatedTask: Task) => void
}

export const useTaskFeedStore = create<TaskFeedStore>((set, get) => ({
    tasks: null,
    setTasks: (tasks) => set({ tasks }),
    getTaskById: (id) => get().tasks?.find((task) => task.id === id),
    updateTask: (updatedTask: Task) => {
    set((state) => {
        if (!state.tasks) {
            console.warn('Tried to update a task, but task list is null.');
            return { tasks: null }
        }
        return {
            tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        };
    });
    }
}))