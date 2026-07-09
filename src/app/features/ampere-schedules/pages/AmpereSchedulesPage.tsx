import { useMemo, useState } from "react";
import { useDebouncedValue } from "../../../../hooks/use-debounced-value";
import { useAuth } from "../../../providers/AuthProvider";
import { AmpereScheduleDetailsSheet } from "../components/AmpereScheduleDetailsSheet";
import { AmpereSchedulesList } from "../components/AmpereSchedulesList";
import { AmpereSchedulesToolbar } from "../components/AmpereSchedulesToolbar";
import { CreateAmpereScheduleSheet } from "../components/CreateAmpereScheduleSheet";
import { DeleteAmpereScheduleDialog } from "../components/DeleteAmpereScheduleDialog";
import { EditAmpereScheduleSheet } from "../components/EditAmpereScheduleSheet";
import { useAmpereSchedulesQuery } from "../queries";
import type { AmpereScheduleRecord } from "../types";

type AmpereScheduleDialogMode = "create" | "delete" | "edit" | "view" | null;

export default function AmpereSchedulesPage() {
  const { session } = useAuth();
  const [dialogMode, setDialogMode] = useState<AmpereScheduleDialogMode>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<AmpereScheduleRecord | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const schedulesQuery = useAmpereSchedulesQuery();
  const canManage = session?.role === "Owner" || session?.role === "Admin";

  const filteredSchedules = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const schedules = schedulesQuery.data ?? [];

    if (!query) {
      return schedules;
    }

    return schedules.filter((schedule) =>
      [
        schedule.name,
        String(schedule.hoursPerDay),
        String(schedule.pricePerAmp),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [debouncedSearch, schedulesQuery.data]);

  function openDialog(mode: Exclude<AmpereScheduleDialogMode, null>, schedule: AmpereScheduleRecord | null = null) {
    setSelectedSchedule(schedule);
    setDialogMode(mode);
  }

  function closeDialog() {
    setDialogMode(null);
    setSelectedSchedule(null);
  }

  return (
    <div className="space-y-4">
      <AmpereSchedulesToolbar
        canManage={canManage}
        isFetching={schedulesQuery.isFetching}
        search={search}
        total={filteredSchedules.length}
        onCreateClick={() => openDialog("create")}
        onSearchChange={setSearch}
      />

      <AmpereSchedulesList
        canManage={canManage}
        error={schedulesQuery.error instanceof Error ? schedulesQuery.error.message : ""}
        isLoading={schedulesQuery.isLoading}
        schedules={filteredSchedules}
        onDelete={(schedule) => openDialog("delete", schedule)}
        onEdit={(schedule) => openDialog("edit", schedule)}
        onView={(schedule) => openDialog("view", schedule)}
      />

      <CreateAmpereScheduleSheet
        open={dialogMode === "create"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <EditAmpereScheduleSheet
        open={dialogMode === "edit"}
        schedule={selectedSchedule}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <DeleteAmpereScheduleDialog
        open={dialogMode === "delete"}
        schedule={selectedSchedule}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <AmpereScheduleDetailsSheet
        open={dialogMode === "view"}
        schedule={selectedSchedule}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
    </div>
  );
}
