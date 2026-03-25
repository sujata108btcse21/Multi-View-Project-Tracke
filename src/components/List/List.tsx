import { useState } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import { useSearchParams } from "react-router-dom";
import { filterTasks } from "../../utils/filterTasks";

const ROW_HEIGHT = 60;
const CONTAINER_HEIGHT = 500;
const BUFFER = 5;

export default function List() {
  const [params] = useSearchParams();
  const originalTasks = useTaskStore((s) => s.tasks);
  const filteredTasks = filterTasks(originalTasks, params);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [scrollTop, setScrollTop] = useState(0);
  const [sortKey, setSortKey] = useState<
    "title" | "priority" | "dueDate"
  >("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const priorityOrder: Record<
    "critical" | "high" | "medium" | "low",
    number
  > = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let result = 0;

    if (sortKey === "title") {
      result = a.title.localeCompare(b.title, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    } else if (sortKey === "priority") {
      result =
        priorityOrder[b.priority] - priorityOrder[a.priority];
    } else if (sortKey === "dueDate") {
      result =
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime();
    }

    return sortOrder === "asc" ? result : -result;
  });

  const totalHeight = sortedTasks.length * ROW_HEIGHT;

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - BUFFER
  );

  const visibleCount =
    Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT) + BUFFER * 2;

  const endIndex = Math.min(
    sortedTasks.length,
    startIndex + visibleCount
  );

  const visibleTasks = sortedTasks.slice(startIndex, endIndex);

  const handleSort = (key: "title" | "priority" | "dueDate") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      <div className="flex font-semibold border-b px-4 py-2 bg-gray-100">
        <div
          className="flex-1 cursor-pointer flex items-center"
          onClick={() => handleSort("title")}
        >
          Title
          {sortKey === "title" && (
            <span className="ml-1 text-blue-500">
              {sortOrder === "asc" ? "↑" : "↓"}
            </span>
          )}
        </div>

        <div
          className="w-32 cursor-pointer flex items-center"
          onClick={() => handleSort("priority")}
        >
          Priority
          {sortKey === "priority" && (
            <span className="ml-1 text-blue-500">
              {sortOrder === "asc" ? "↑" : "↓"}
            </span>
          )}
        </div>

        <div
          className="w-40 cursor-pointer flex items-center"
          onClick={() => handleSort("dueDate")}
        >
          Due Date
          {sortKey === "dueDate" && (
            <span className="ml-1 text-blue-500">
              {sortOrder === "asc" ? "↑" : "↓"}
            </span>
          )}
        </div>

        <div className="w-40">Status</div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No tasks found</p>
          <button
            onClick={() => window.location.search = ""}
            className="mt-2 text-blue-500 underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div
          className="border rounded bg-white overflow-auto"
          style={{ height: CONTAINER_HEIGHT }}
          onScroll={(e) =>
            setScrollTop(e.currentTarget.scrollTop)
          }
        >
          <div style={{ height: totalHeight, position: "relative" }}>
            <div
              style={{
                transform: `translateY(${startIndex * ROW_HEIGHT}px)`,
              }}
            >
              {visibleTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between px-4 border-b"
                  style={{ height: ROW_HEIGHT }}
                >
                  <div className="flex-1 text-sm font-medium">
                    {task.title}
                  </div>

                  <div className="w-32 text-sm capitalize">
                    {task.priority}
                  </div>

                  <div className="w-40 text-sm">
                    {(() => {
                      const today = new Date();
                      const due = new Date(task.dueDate);

                      const isToday =
                        due.toDateString() === today.toDateString();

                      const diffDays = Math.floor(
                        (today.getTime() - due.getTime()) /
                        (1000 * 60 * 60 * 24)
                      );

                      const isOverdue = due < today;

                      if (isToday) return "Due Today";

                      if (isOverdue) {
                        return diffDays > 7
                          ? `${diffDays} days overdue`
                          : `Overdue (${diffDays}d)`;
                      }

                      return due.toLocaleDateString();
                    })()}
                  </div>

                  <div className="w-40">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTask(
                          task.id,
                          e.target.value as any
                        )
                      }
                      className="border px-2 py-1 text-xs rounded"
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="review">In Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}