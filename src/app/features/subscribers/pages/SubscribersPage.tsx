import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { useAreasQuery } from "../../areas/queries";
import { SubscribersPageSkeleton } from "../components/SubscribersPageSkeleton";
import { SubscribersTable } from "../components/SubscribersTable";
import { SubscribersToolbar } from "../components/SubscribersToolbar";
import {
  useSubscribersQuery,
  useSubscriberCustomerRelationsQuery,
  useSubscriberAmpereSchedulesQuery,
  useSubscriberPlanTypesQuery,
} from "../queries";
import type {
  SubscriberRow,
  SubscriberSearchField,
  SubscribersQueryFilters,
} from "../types";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { useDebouncedValue } from "../../../../hooks/use-debounced-value";
import { exportCustomers } from "../../areas/areasApi";
import { toast } from "sonner";

type SubscriberDialogMode = "create" | "delete" | "edit" | "suspend" | "view" | null;

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
const SuspendSubscriberDialog = lazy(() =>
  import("../components/SuspendSubscriberDialog").then((module) => ({ default: module.SuspendSubscriberDialog })),
);

export default function SubscribersPage() {
  const { session } = useAuth();
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogMode, setDialogMode] = useState<SubscriberDialogMode>(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberRow | null>(null);
  const [searchField, setSearchField] = useState<SubscriberSearchField>(
    () => (searchParams.get("field") as SubscriberSearchField) || "name",
  );
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") ?? "");
  const [areaId, setAreaId] = useState("");
  const [planType, setPlanType] = useState("");
  const [customerRelation, setCustomerRelation] = useState("");
  const [customerStatus, setCustomerStatus] = useState("");
  const [ampereScheduleId, setAmpereScheduleId] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isExporting, setIsExporting] = useState(false);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
      params.set("field", searchField);
    }
    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, searchField, setSearchParams]);
  const filters = useMemo<SubscribersQueryFilters>(
    () => ({
      areaId,
      ampereScheduleId: ampereScheduleId || undefined,
      customerRelation,
      customerStatus,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      planType,
      searchField,
      searchTerm: debouncedSearchTerm,
    }),
    [
      areaId,
      ampereScheduleId,
      customerRelation,
      customerStatus,
      debouncedSearchTerm,
      pagination.pageIndex,
      pagination.pageSize,
      planType,
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
  const planTypesQuery = useSubscriberPlanTypesQuery();
  const customerRelationsQuery = useSubscriberCustomerRelationsQuery();
  const ampereSchedulesQuery = useSubscriberAmpereSchedulesQuery();
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

  function handleSuspend(subscriber: SubscriberRow) {
    openDialog("suspend", subscriber);
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

  async function handleExport() {
    if (!session?.token) return;

    setIsExporting(true);
    try {
      await exportCustomers(session.token, areaId || undefined, session.companyId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("subscribers.export.failed"));
    } finally {
      setIsExporting(false);
    }
  }

  if (isLoading && !subscribersPage) {
    return <SubscribersPageSkeleton />;
  }

  return (
    <div className="space-y-4">
      <SubscribersToolbar
        ampereScheduleId={ampereScheduleId}
        ampereSchedules={ampereSchedulesQuery.data ?? []}
        areaId={areaId}
        areas={areasQuery.data ?? []}
        canExport={session?.role === "Owner"}
        customerRelation={customerRelation}
        customerRelations={customerRelationsQuery.data ?? []}
        customerStatus={customerStatus}
        isExporting={isExporting}
        isFetching={isFetching}
        planType={planType}
        planTypes={planTypesQuery.data ?? []}
        searchField={searchField}
        searchTerm={searchTerm}
        total={subscribersPage?.totalCount ?? 0}
        onAdvancedFiltersChange={(nextFilters) => {
          setAmpereScheduleId(nextFilters.ampereScheduleId);
          setCustomerRelation(nextFilters.customerRelation);
          setCustomerStatus(nextFilters.customerStatus);
          setPlanType(nextFilters.planType);
          resetToFirstPage();
        }}
        onAreaChange={(value) => {
          setAreaId(value);
          resetToFirstPage();
        }}
        onCreateClick={() => openDialog("create")}
        onExportClick={handleExport}
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
        canSuspend={session?.role === "Owner"}
        data={subscribers}
        error={error instanceof Error ? error.message : ""}
        isFetching={isFetching}
        isLoading={isLoading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSuspend={handleSuspend}
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
        {dialogMode === "suspend" ? (
          <SuspendSubscriberDialog
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
