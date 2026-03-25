import { useTaskStore } from "../../store/useTaskStore";
import { useSearchParams } from "react-router-dom";
import { filterTasks } from "../../utils/filterTasks";

const DAY_WIDTH = 40;
const ROW_HEIGHT = 60;
const LABEL_WIDTH = 200;

export default function Timeline() {
  const [params] = useSearchParams();
  const tasks = useTaskStore((s) => s.tasks);
  const filteredTasks = filterTasks(tasks, params);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const getDayIndex = (dateString: string) => {
    const date = new Date(dateString);

    if (
      date.getMonth() !== currentMonth ||
      date.getFullYear() !== currentYear
    ) {
      return null;
    }

    return date.getDate() - 1;
  };

  const getColor = (priority: string) => {
    if (priority === "critical") return "bg-red-400";
    if (priority === "high") return "bg-orange-400";
    if (priority === "medium") return "bg-yellow-400";
    return "bg-green-400";
  };

  // EMPTY STATE
  if (filteredTasks.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        <p className="text-lg font-medium">No tasks to display</p>
        <p className="text-sm">Try clearing filters</p>
      </div>
    );
  }

  return (
    <div className="flex border rounded-xl bg-white shadow-sm overflow-hidden">

      <div
        className="bg-gray-50 border-r"
        style={{ width: LABEL_WIDTH }}
      >
        <div className="h-10 border-b flex items-center px-3 font-semibold text-sm">
          Tasks
        </div>

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center px-3 border-b text-sm text-gray-700 truncate"
            style={{ height: ROW_HEIGHT }}
          >
            {task.title}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto relative">
        <div
          className="flex border-b bg-gray-50 relative"
          style={{ width: daysInMonth * DAY_WIDTH }}
        >
          {Array.from({ length: daysInMonth }).map((_, i) => (
            <div
              key={i}
              className="text-xs text-gray-500 border-r flex items-center justify-center"
              style={{ width: DAY_WIDTH, height: 40 }}
            >
              {i + 1}
            </div>
          ))}

          <div
            className="absolute top-0 bottom-0 border-l-2 border-red-500"
            style={{
              left: (today.getDate() - 1) * DAY_WIDTH,
            }}
          />
        </div>

        <div
          style={{ width: daysInMonth * DAY_WIDTH }}
          className="relative"
        >
          {filteredTasks.map((task) => {
            const startIndex = getDayIndex(
              task.startDate || task.dueDate
            );
            const endIndex = getDayIndex(task.dueDate);

            if (startIndex === null || endIndex === null) return null;

            const hasStart = !!task.startDate;

            const left = startIndex * DAY_WIDTH;

            const width = hasStart
              ? Math.max((endIndex - startIndex + 1) * DAY_WIDTH, 12)
              : 12;

            return (
              <div
                key={task.id}
                className="relative border-b"
                style={{ height: ROW_HEIGHT }}
              >
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-r border-gray-200"
                    style={{ left: i * DAY_WIDTH }}
                  />
                ))}

                <div
                  className={`absolute h-7 rounded-md text-white text-xs px-2 flex items-center shadow-sm ${getColor(
                    task.priority
                  )}`}
                  style={{
                    left,
                    width,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <span className="truncate">{task.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}