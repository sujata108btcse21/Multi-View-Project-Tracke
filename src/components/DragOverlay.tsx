import { useTaskStore } from "../store/useTaskStore";

export default function DragOverlay() {
  const tasks = useTaskStore((s) => s.tasks);
  const draggingTaskId = useTaskStore((s) => s.draggingTaskId);
  const dragPosition = useTaskStore((s) => s.dragPosition);

  if (!draggingTaskId || !dragPosition) return null;

  const task = tasks.find((t) => t.id === draggingTaskId);
  if (!task) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-300 ease-out"
      style={{
        top: dragPosition.y,
        left: dragPosition.x,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="bg-white p-3 rounded-xl shadow-2xl border opacity-80 scale-95">
        <p className="text-sm font-semibold">{task.title}</p>
      </div>
    </div>
  );
}