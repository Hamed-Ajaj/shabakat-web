import { useDeferredValue, useState } from "react";
import { subscribers } from "../../../shared/data/mockData";
import type { Status } from "../../../shared/types/domain";
import { SubscribersTable } from "../components/SubscribersTable";
import { SubscribersToolbar } from "../components/SubscribersToolbar";

export default function SubscribersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | Status>("all");
  const deferredSearch = useDeferredValue(search);

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const query = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      subscriber.name.toLowerCase().includes(query) ||
      subscriber.area.toLowerCase().includes(query) ||
      subscriber.phone.includes(query);
    const matchesStatus = status === "all" || subscriber.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <SubscribersToolbar
        search={search}
        status={status}
        total={subscribers.length}
        filteredCount={filteredSubscribers.length}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
      <SubscribersTable data={filteredSubscribers} />
    </div>
  );
}
