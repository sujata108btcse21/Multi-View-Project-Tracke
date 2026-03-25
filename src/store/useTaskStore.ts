import { create } from "zustand";

export type Status = "todo" | "inprogress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: "low" | "medium" | "high" | "critical";
  status: Status;
  dueDate: string;
  startDate?: string | null;
}

interface Presence {
  user: string;
  color: string;
  taskId: string;
}

interface Store {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTask: (id: string, status: Status) => void;
  presence: Presence[];
  setPresence: (p: Presence[]) => void;
  draggingTaskId: string | null;
  setDraggingTaskId: (id: string | null) => void;

  dragPosition: { x: number; y: number } | null;
  setDragPosition: (pos: { x: number; y: number } | null) => void;
  placeholderHeight: number;
  setPlaceholderHeight: (h: number) => void;
}

export const useTaskStore = create<Store>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  updateTask: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),
  presence: [],
  setPresence: (p) => set({ presence: p }),
  draggingTaskId: null,
  setDraggingTaskId: (id) => set({ draggingTaskId: id }),

  dragPosition: null,
  setDragPosition: (pos) => set({ dragPosition: pos }),
  placeholderHeight: 80,
  setPlaceholderHeight: (h) => set({ placeholderHeight: h }),
}));