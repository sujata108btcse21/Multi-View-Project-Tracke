export function filterTasks(tasks: any[], params: URLSearchParams) {
  return tasks.filter((task) => {
    const status = params.get("status")?.split(",").filter(Boolean) || [];
    const priority = params.get("priority")?.split(",").filter(Boolean) || [];
    const assignee = params.get("assignee")?.split(",").filter(Boolean) || [];

    const search = params.get("search")?.toLowerCase().trim() || "";

    const from = params.get("from");
    const to = params.get("to");

    if (status.length && !status.includes(task.status)) return false;

    if (priority.length && !priority.includes(task.priority)) return false;

    if (assignee.length && !assignee.includes(task.assignee)) return false;

    if (
      search &&
      !task.title.toLowerCase().includes(search)
    ) {
      return false;
    }

    const due = new Date(task.dueDate);

    if (from) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      if (due < fromDate) return false;
    }

    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      if (due > toDate) return false;
    }

    return true;
  });
}