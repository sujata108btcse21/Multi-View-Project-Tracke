import { useEffect, useRef, useState } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import TaskCard from "./TaskCard";

interface Props {
  status: string;
  tasks: any[];
}

export default function Column({
  status,
  tasks,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);
  const draggingTaskId = useTaskStore((s) => s.draggingTaskId);

  useEffect(() => {
    if (!draggingTaskId) return;

    const handleMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();

      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      setIsOver(isInside);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [draggingTaskId]);


  const placeholderHeight = useTaskStore((s) => s.placeholderHeight);

  return (
    <div
      ref={ref}
      data-column={status}
      className={`p-2 rounded min-h-[300px] max-h-[80vh] overflow-y-auto transition ${isOver
          ? "bg-blue-200 ring-2 ring-blue-400"
          : "bg-gray-100"
        }`}
    >
      <h2 className="font-semibold text-gray-700 mb-3 flex justify-between">
        <span className="capitalize">{status}</span>
        <span className="bg-gray-300 text-xs px-2 py-1 rounded">
          {tasks.length}
        </span>
      </h2>
      {tasks.length === 0 ? (
        <div className="text-center text-gray-400 mt-10 text-sm">
          No tasks in this column
        </div>
      ) : (
        tasks.map((task) =>
          draggingTaskId === task.id ? (
            <div
              key={task.id}
              style={{ height: placeholderHeight }}
              className="mb-2 bg-gray-300 rounded transition-all duration-200"
            />
          ) : (
            <TaskCard
              key={task.id}
              task={task}
            />
          )
        )
      )}
    </div>
  );
}