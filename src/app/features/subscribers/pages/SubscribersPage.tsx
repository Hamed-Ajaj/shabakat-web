import { useDeferredValue, useState } from "react";
import { CreateSubscriberSheet } from "../components/CreateSubscriberSheet";
import { DeleteSubscriberDialog } from "../components/DeleteSubscriberDialog";
import { EditSubscriberSheet } from "../components/EditSubscriberSheet";
import { SubscriberDetailsSheet } from "../components/SubscriberDetailsSheet";
import { SubscribersTable } from "../components/SubscribersTable";
import { SubscribersToolbar } from "../components/SubscribersToolbar";
import { useSubscribersQuery } from "../queries";
import type { SubscriberBillingStatus, SubscriberRow } from "../types";
import { useAuth } from "../../../providers/AuthProvider";

type SubscriberDialogMode = "create" | "delete" | "edit" | "view" | null;

export default function SubscribersPage() {
  const { session } = useAuth();
  const [dialogMode, setDialogMode] = useState<SubscriberDialogMode>(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberRow | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | SubscriberBillingStatus>("all");
  const deferredSearch = useDeferredValue(search);
  const { data: subscribers = [], error, isLoading } = useSubscribersQuery();
  const canDelete = session?.role === "Owner" || session?.role === "Admin";

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

  function openDialog(mode: Exclude<SubscriberDialogMode, null>, subscriber: SubscriberRow | null = null) {
    setSelectedSubscriber(subscriber);
    setDialogMode(mode);
  }

  function closeDialog() {
    setDialogMode(null);
    setSelectedSubscriber(null);
  }

  function handleView(subscriber: SubscriberRow) {
    openDialog("view", subscriber);
  }

  function handleEdit(subscriber: SubscriberRow) {
    openDialog("edit", subscriber);
  }

  function handleDelete(subscriber: SubscriberRow) {
    openDialog("delete", subscriber);
  }

  return (
    <div className="space-y-4">
      <SubscribersToolbar
        search={search}
        status={status}
        total={subscribers.length}
        filteredCount={filteredSubscribers.length}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCreateClick={() => openDialog("create")}
      />
      <SubscribersTable
        canDelete={canDelete}
        data={filteredSubscribers}
        error={error instanceof Error ? error.message : ""}
        isLoading={isLoading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
      />
      <CreateSubscriberSheet
        open={dialogMode === "create"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <EditSubscriberSheet
        open={dialogMode === "edit"}
        subscriberId={selectedSubscriber?.id ?? null}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <SubscriberDetailsSheet
        open={dialogMode === "view"}
        subscriberId={selectedSubscriber?.id ?? null}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <DeleteSubscriberDialog
        open={dialogMode === "delete"}
        subscriberId={selectedSubscriber?.id ?? null}
        subscriberName={selectedSubscriber?.name ?? ""}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
    </div>
  );
}
