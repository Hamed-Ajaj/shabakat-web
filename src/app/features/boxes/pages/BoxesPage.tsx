import { useMemo, useState } from "react";
import { useDebouncedValue } from "../../../../hooks/use-debounced-value";
import { useAuth } from "../../../providers/AuthProvider";
import { useAreasQuery } from "../../areas/queries";
import { BoxDetailsSheet } from "../components/BoxDetailsSheet";
import { BoxesList } from "../components/BoxesList";
import { BoxesToolbar } from "../components/BoxesToolbar";
import { CreateBoxSheet } from "../components/CreateBoxSheet";
import { EditBoxSheet } from "../components/EditBoxSheet";
import { useBoxesQuery } from "../queries";
import type { BoxRecord } from "../types";

type BoxDialogMode = "create" | "edit" | "view" | null;

export default function BoxesPage() {
  const { session } = useAuth();
  const [dialogMode, setDialogMode] = useState<BoxDialogMode>(null);
  const [selectedBox, setSelectedBox] = useState<BoxRecord | null>(null);
  const [search, setSearch] = useState("");
  const [areaId, setAreaId] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const areasQuery = useAreasQuery();
  const boxesQuery = useBoxesQuery(areaId || undefined);
  const canManage = session?.role === "Owner" || session?.role === "Admin";

  const filteredBoxes = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const boxes = boxesQuery.data ?? [];

    if (!query) {
      return boxes;
    }

    return boxes.filter((box) =>
      [box.name, box.areaName, box.locationNote ?? "", box.notes ?? ""].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [boxesQuery.data, debouncedSearch]);

  function openDialog(mode: Exclude<BoxDialogMode, null>, box: BoxRecord | null = null) {
    setSelectedBox(box);
    setDialogMode(mode);
  }

  function closeDialog() {
    setDialogMode(null);
    setSelectedBox(null);
  }

  const error =
    boxesQuery.error instanceof Error
      ? boxesQuery.error.message
      : areasQuery.error instanceof Error
        ? areasQuery.error.message
        : "";

  return (
    <div className="space-y-4">
      <BoxesToolbar
        areas={areasQuery.data ?? []}
        areaId={areaId}
        canManage={canManage}
        isFetching={boxesQuery.isFetching}
        search={search}
        total={filteredBoxes.length}
        onAreaChange={setAreaId}
        onCreateClick={() => openDialog("create")}
        onSearchChange={setSearch}
      />

      <BoxesList
        boxes={filteredBoxes}
        canManage={canManage}
        error={error}
        isLoading={boxesQuery.isLoading || areasQuery.isLoading}
        onEdit={(box) => openDialog("edit", box)}
        onView={(box) => openDialog("view", box)}
      />

      <CreateBoxSheet
        open={dialogMode === "create"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <EditBoxSheet
        box={selectedBox}
        open={dialogMode === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
      <BoxDetailsSheet
        box={selectedBox}
        open={dialogMode === "view"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
    </div>
  );
}

