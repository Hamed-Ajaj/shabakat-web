import { useMemo, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { CreateSubscriberSheet } from "../components/CreateSubscriberSheet";
import { DeleteSubscriberDialog } from "../components/DeleteSubscriberDialog";
import { EditSubscriberSheet } from "../components/EditSubscriberSheet";
import { SubscriberDetailsSheet } from "../components/SubscriberDetailsSheet";
import { SubscribersTable } from "../components/SubscribersTable";
import { SubscribersToolbar } from "../components/SubscribersToolbar";
import {
  useSubscriberAreasQuery,
  useSubscribersQuery,
} from "../queries";
import type {
  SubscriberRow,
  SubscriberSearchField,
  SubscribersQueryFilters,
} from "../types";
import { useAuth } from "../../../providers/AuthProvider";
import { useDebouncedValue } from "../../../../hooks/use-debounced-value";

type SubscriberDialogMode = "create" | "delete" | "edit" | "view" | null;

export default function SubscribersPage() {
  const { session } = useAuth();
  const [dialogMode, setDialogMode] = useState<SubscriberDialogMode>(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberRow | null>(null);
  const [searchField, setSearchField] = useState<SubscriberSearchField>("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [areaId, setAreaId] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);
  const filters = useMemo<SubscribersQueryFilters>(
    () => ({
      areaId,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      searchField,
      searchTerm: debouncedSearchTerm,
    }),
    [
      areaId,
      debouncedSearchTerm,
      pagination.pageIndex,
      pagination.pageSize,
      searchField,
    ],
  );
  const {
    data: subscribersPage,
    error,
    isFetching,
    isLoading,
  } = useSubscribersQuery(filters);
  const areasQuery = useSubscriberAreasQuery();
  const canDelete = session?.role === "Owner" || session?.role === "Admin";
  const subscribers = subscribersPage?.data ?? [];

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

  function resetToFirstPage() {
    setPagination((current) => ({
      ...current,
      pageIndex: 0,
    }));
  }

  return (
    <div className="space-y-4">
      <SubscribersToolbar
        areaId={areaId}
        areas={areasQuery.data ?? []}
        isFetching={isFetching}
        searchField={searchField}
        searchTerm={searchTerm}
        total={subscribersPage?.totalCount ?? 0}
        onAreaChange={(value) => {
          setAreaId(value);
          resetToFirstPage();
        }}
        onCreateClick={() => openDialog("create")}
        onSearchFieldChange={(value) => {
          setSearchField(value);
          resetToFirstPage();
        }}
        onSearchTermChange={(value) => {
          setSearchTerm(value);
          resetToFirstPage();
        }}
      />
      <SubscribersTable
        canDelete={canDelete}
        data={subscribers}
        error={error instanceof Error ? error.message : ""}
        isFetching={isFetching}
        isLoading={isLoading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onPaginationChange={setPagination}
        onPageSizeChange={(value) => {
          setPagination({
            pageIndex: 0,
            pageSize: value,
          });
        }}
        onView={handleView}
        pagination={pagination}
        totalCount={subscribersPage?.totalCount ?? 0}
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
