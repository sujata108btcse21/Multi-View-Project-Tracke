import { useSearchParams } from "react-router-dom";
import MultiSelect from "./MultiSelect";

export default function FilterBar() {
  const [params, setParams] = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (value) newParams.set(key, value);
    else newParams.delete(key);

    setParams(newParams);
  };

  const clearFilters = () => setParams({});

  const hasFilters = Array.from(params.entries()).some(
    ([_, value]) => value.trim() !== ""
  );

  const statusOptions = [
    { label: "To Do", value: "todo" },
    { label: "In Progress", value: "inprogress" },
    { label: "Review", value: "review" },
    { label: "Done", value: "done" },
  ];

  const priorityOptions = [
    { label: "Critical", value: "critical" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  const assigneeOptions = [
    { label: "SY", value: "SY" },
    { label: "AK", value: "AK" },
    { label: "RM", value: "RM" },
    { label: "DT", value: "DT" },
    { label: "JS", value: "JS" },
    { label: "KP", value: "KP" },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          placeholder="Search tasks..."
          className="border px-3 py-2 rounded-lg w-[250px]"
          value={params.get("search") || ""}
          onChange={(e) => updateParam("search", e.target.value)}
        />

        <MultiSelect
          label="Status"
          paramKey="status"
          options={statusOptions}
          params={params}
          setParams={setParams}
        />

        <MultiSelect
          label="Priority"
          paramKey="priority"
          options={priorityOptions}
          params={params}
          setParams={setParams}
        />

        <MultiSelect
          label="Assignee"
          paramKey="assignee"
          options={assigneeOptions}
          params={params}
          setParams={setParams}
        />

        <div className="flex gap-3 items-center">

          <label className="text-xs text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            className="border px-3 py-2 rounded-lg"
            value={params.get("from") || ""}
            onChange={(e) => updateParam("from", e.target.value)}
          />
          <label className="text-xs text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            className="border px-3 py-2 rounded-lg"
            value={params.get("to") || ""}
            onChange={(e) => updateParam("to", e.target.value)}
          />
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Clear Filters
          </button>
        )}
      </div>

    </div>
  );
}
