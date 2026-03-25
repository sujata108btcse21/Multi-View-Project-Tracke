import { useRef } from "react";

import { useTaskStore } from "../../store/useTaskStore";

interface Props {
  task: any;
  setDraggingId: (id: string | null) => void;
}

export default function TaskCard({
  task,
}: Props) {
  const draggingTaskId = useTaskStore((s) => s.draggingTaskId);
  const setDraggingTaskId = useTaskStore((s) => s.setDraggingTaskId);
  const setDragPosition = useTaskStore((s) => s.setDragPosition);
  const presence = useTaskStore((s) => s.presence);
  const usersHere = presence.filter((p) => p.taskId === task.id);
  const today = new Date();
  const cardRef = useRef<HTMLDivElement>(null);
  const due = new Date(task.dueDate);

  const isOverdue = due < today;
  const isToday = due.toDateString() === today.toDateString();

  const diffDays = Math.floor(
    (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
  );

  const handlePointerMove = (e: PointerEvent) => {
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const updateTask = useTaskStore((s) => s.updateTask);

  const handlePointerUp = (e: PointerEvent) => {
    const element = document.elementFromPoint(e.clientX, e.clientY);

    const column = element?.closest("[data-column]");

    if (column) {
      const status = column.getAttribute("data-column");
      if (status) {
        updateTask(task.id, status as any);
      }
    }

    setDraggingTaskId(null);
    setDragPosition(null);

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setDraggingTaskId(task.id);
    setDragPosition({ x: e.clientX, y: e.clientY });
    const setPlaceholderHeight = useTaskStore(
      (s) => s.setPlaceholderHeight
    );

    if (cardRef.current) {
      setPlaceholderHeight(cardRef.current.offsetHeight);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      className={`bg-white p-3 mb-3 rounded-xl shadow-sm border cursor-grab
  transition-all duration-200 ease-in-out
  hover:shadow-md
  ${draggingTaskId === task.id ? "opacity-40 scale-95" : "scale-100"}
`}
    >
      <p className="font-semibold text-sm text-gray-800">
        {task.title}
      </p>

      <div className="flex items-center justify-between mt-3">

        <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
          {task.assignee}
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${task.priority === "critical"
            ? "bg-red-100 text-red-600"
            : task.priority === "high"
              ? "bg-orange-100 text-orange-600"
              : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
        >
          {task.priority}
        </span>
        <div className="flex -space-x-2 mt-2 relative h-6">
          {usersHere.slice(0, 2).map((p, i) => (
            <div
              key={p.user}
              className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center transition-all duration-500 ease-in-out ${p.color}`}
              style={{
                transform: `translateX(${i * 16}px)`,
              }}
            >
              {p.user}
            </div>
          ))}

          {usersHere.length > 2 && (
            <div className="w-6 h-6 bg-gray-400 text-white text-xs flex items-center justify-center rounded-full ml-8">
              +{usersHere.length - 2}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 text-xs">
        <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-500"}>
          {isToday
            ? "Due Today"
            : isOverdue
              ? diffDays > 7
                ? `${diffDays} days overdue`
                : `Overdue (${diffDays}d)`
              : due.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}