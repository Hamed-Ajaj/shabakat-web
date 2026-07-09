import { Suspense, lazy, useMemo, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { useAreasQuery } from "../../areas/queries";
import { SubscribersPageSkeleton } from "../components/SubscribersPageSkeleton";
import { SubscribersTable } from "../components/SubscribersTable";
import { SubscribersToolbar } from "../components/SubscribersToolbar";
import {
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

const CreateSubscriberSheet = lazy(() =>
  import("../components/CreateSubscriberSheet").then((module) => ({ default: module.CreateSubscriberSheet })),
);
const EditSubscriberSheet = lazy(() =>
  import("../components/EditSubscriberSheet").then((module) => ({ default: module.EditSubscriberSheet })),
);
const SubscriberDetailsSheet = lazy(() =>
  import("../components/SubscriberDetailsSheet").then((module) => ({ default: module.SubscriberDetailsSheet })),
);
const DeleteSubscriberDialog = lazy(() =>
  import("../components/DeleteSubscriberDialog").then((module) => ({ default: module.DeleteSubscriberDialog })),
);

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
  const areasQuery = useAreasQuery();
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

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      closeDialog();
    }
  }

  if (isLoading && !subscribersPage) {
    return <SubscribersPageSkeleton />;
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
      <Suspense fallback={null}>
        {dialogMode === "create" ? (
          <CreateSubscriberSheet
            open
            onOpenChange={handleDialogOpenChange}
          />
        ) : null}
        {dialogMode === "edit" ? (
          <EditSubscriberSheet
            open
            subscriberId={selectedSubscriber?.id ?? null}
            onOpenChange={handleDialogOpenChange}
          />
        ) : null}
        {dialogMode === "view" ? (
          <SubscriberDetailsSheet
            open
            subscriberId={selectedSubscriber?.id ?? null}
            onOpenChange={handleDialogOpenChange}
          />
        ) : null}
        {dialogMode === "delete" ? (
          <DeleteSubscriberDialog
            open
            subscriberId={selectedSubscriber?.id ?? null}
            subscriberName={selectedSubscriber?.name ?? ""}
            onOpenChange={handleDialogOpenChange}
          />
        ) : null}
      </Suspense>
    </div>
  );
}
