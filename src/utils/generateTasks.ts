import type { Task } from "../store/useTaskStore";

const users = ["SY", "AK", "RM", "DT", "JS", "KP"];
const priorities = ["low", "medium", "high", "critical"];
const statuses = ["todo", "inprogress", "review", "done"];

const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const generateTasks = (count = 500): Task[] =>
  Array.from({ length: count }, (_, i) => {
    const today = new Date();

    const due = randomDate(
      new Date(today.getFullYear(), today.getMonth() - 1, 1),
      new Date(today.getFullYear(), today.getMonth() + 1, 28)
    );

    const hasStart = Math.random() > 0.3;

    const start = hasStart
      ? randomDate(
        new Date(due.getTime() - 10 * 24 * 60 * 60 * 1000),
        due
      )
      : null;

    return {
      id: `task-${i}`,
      title: `Task ${i}`,
      assignee: users[Math.floor(Math.random() * users.length)],
      priority: priorities[Math.floor(Math.random() * 4)] as any,
      status: statuses[Math.floor(Math.random() * 4)] as any,
      dueDate: due.toISOString(),
      startDate: start ? start.toISOString() : null,
    };
  });