import { useMemo } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import Column from "./Column";
import { useSearchParams } from "react-router-dom";
import { filterTasks } from "../../utils/filterTasks";

const columns = ["todo", "inprogress", "review", "done"];

export default function Kanban() {
  const [params] = useSearchParams();
  const tasks = useTaskStore((s) => s.tasks);
  const filteredTasks = useMemo(
    () => filterTasks(tasks, params),
    [tasks, params]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {columns.map((col) => (
        <Column
          key={col}
          status={col}
          tasks={filteredTasks.filter((t) => t.status === col)}
        />
      ))}
    </div>
  );
}