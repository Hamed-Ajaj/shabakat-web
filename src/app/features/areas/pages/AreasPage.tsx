import { useMemo, useState } from "react";
import { useDebouncedValue } from "../../../../hooks/use-debounced-value";
import { useAuth } from "../../../providers/AuthProvider";
import { AreaDetailsSheet } from "../components/AreaDetailsSheet";
import { AreasList } from "../components/AreasList";
import { AreasToolbar } from "../components/AreasToolbar";
import { CreateAreaSheet } from "../components/CreateAreaSheet";
import { DeleteAreaDialog } from "../components/DeleteAreaDialog";
import { EditAreaSheet } from "../components/EditAreaSheet";
import { useAreasQuery } from "../queries";
import type { AreaRecord } from "../types";

type AreaDialogMode = "create" | "delete" | "edit" | "view" | null;

export default function AreasPage() {
  const { session } = useAuth();
  const [dialogMode, setDialogMode] = useState<AreaDialogMode>(null);
  const [selectedArea, setSelectedArea] = useState<AreaRecord | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data: areas = [], error, isFetching, isLoading } = useAreasQuery();
  const canManage = session?.role === "Owner" || session?.role === "Admin";

  const filteredAreas = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    if (!query) {
      return areas;
    }

    return areas.filter((area) => area.name.toLowerCase().includes(query));
  }, [areas, debouncedSearch]);

  function openDialog(mode: Exclude<AreaDialogMode, null>, area: AreaRecord | null = null) {
    setSelectedArea(area);
    setDialogMode(mode);
  }

  function closeDialog() {
    setDialogMode(null);
    setSelectedArea(null);
  }

  return (
    <div className="space-y-4">
      <AreasToolbar
        canManage={canManage}
        isFetching={isFetching}
        search={search}
        total={filteredAreas.length}
        onCreateClick={() => openDialog("create")}
        onSearchChange={setSearch}
      />

      <AreasList
        areas={filteredAreas}
        canManage={canManage}
        error={error instanceof Error ? error.message : ""}
        isLoading={isLoading}
        onDelete={(area) => openDialog("delete", area)}
        onEdit={(area) => openDialog("edit", area)}
        onView={(area) => openDialog("view", area)}
      />

      <CreateAreaSheet
        open={dialogMode === "create"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <EditAreaSheet
        area={selectedArea}
        open={dialogMode === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <AreaDetailsSheet
        area={selectedArea}
        open={dialogMode === "view"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <DeleteAreaDialog
        area={selectedArea}
        open={dialogMode === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
    </div>
  );
}
