import { useEffect, useState } from "react";
import { useTaskStore } from "./store/useTaskStore";
import { generateTasks } from "./utils/generateTasks";
import Kanban from "./components/Kanban/Kanban";
import List from "./components/List/List";
import Timeline from "./components/Timeline/Timeline";
import FilterBar from "./components/Filters/FilterBar";
import DragOverlay from "./components/DragOverlay";

function App() {
  const setTasks = useTaskStore((s) => s.setTasks);
  const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");

  useEffect(() => {
    setTasks(generateTasks(500));
  }, []);

  useEffect(() => {
    const users = ["A", "B", "C", "D"];
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-blue-500",
    ];

    const interval = setInterval(() => {
      const tasks = useTaskStore.getState().tasks;
      if (!tasks.length) return;

      const next = users.map((u, i) => {
        const randomTask =
          tasks[Math.floor(Math.random() * tasks.length)];

        return {
          user: u,
          color: colors[i],
          taskId: randomTask.id,
        };
      });

      useTaskStore.getState().setPresence(next);
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  const presence = useTaskStore((s) => s.presence);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setView("kanban")}
          className={`px-4 py-2 rounded ${view === "kanban" ? "bg-blue-500 text-white" : "bg-white border"
            }`}
        >
          Kanban
        </button>

        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded ${view === "list" ? "bg-blue-500 text-white" : "bg-white border"
            }`}
        >
          List
        </button>

        <button
          onClick={() => setView("timeline")}
          className={`px-4 py-2 rounded ${view === "timeline" ? "bg-blue-500 text-white" : "bg-white border"
            }`}
        >
          Timeline
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex -space-x-2">
          {presence.map((p) => (
            <div
              key={p.user}
              className={`w-8 h-8 rounded-full text-white text-sm flex items-center justify-center ${p.color}`}
            >
              {p.user}
            </div>
          ))}
        </div>

        <span className="text-gray-600 text-sm">
          {presence.length} people are viewing this board
        </span>
      </div>

      <FilterBar />
      {view === "kanban" && <Kanban />}
      {view === "list" && <List />}
      {view === "timeline" && <Timeline />}
      <DragOverlay />
    </div>
  );
}

export default App;