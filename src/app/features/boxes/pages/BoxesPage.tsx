import { Suspense, lazy, useMemo, useState } from "react";
import { useDebouncedValue } from "../../../../hooks/use-debounced-value";
import { useAuth } from "../../../providers/AuthProvider";
import { useAreasQuery } from "../../areas/queries";
import { BoxesList } from "../components/BoxesList";
import { BoxesPageSkeleton } from "../components/BoxesPageSkeleton";
import { BoxesToolbar } from "../components/BoxesToolbar";
import { useBoxesQuery } from "../queries";
import type { BoxRecord } from "../types";

type BoxDialogMode = "create" | "edit" | "view" | null;

const CreateBoxSheet = lazy(() =>
  import("../components/CreateBoxSheet").then((module) => ({ default: module.CreateBoxSheet })),
);
const EditBoxSheet = lazy(() =>
  import("../components/EditBoxSheet").then((module) => ({ default: module.EditBoxSheet })),
);
const BoxDetailsSheet = lazy(() =>
  import("../components/BoxDetailsSheet").then((module) => ({ default: module.BoxDetailsSheet })),
);

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

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      closeDialog();
    }
  }

  const error =
    boxesQuery.error instanceof Error
      ? boxesQuery.error.message
      : areasQuery.error instanceof Error
        ? areasQuery.error.message
        : "";

  if (boxesQuery.isLoading && areasQuery.isLoading && !boxesQuery.data && !areasQuery.data) {
    return <BoxesPageSkeleton />;
  }

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

      <Suspense fallback={null}>
        {dialogMode === "create" ? (
          <CreateBoxSheet
            open
            onOpenChange={handleDialogOpenChange}
          />
        ) : null}
        {dialogMode === "edit" ? (
          <EditBoxSheet
            box={selectedBox}
            open
            onOpenChange={handleDialogOpenChange}
          />
        ) : null}
        {dialogMode === "view" ? (
          <BoxDetailsSheet
            box={selectedBox}
            open
            onOpenChange={handleDialogOpenChange}
          />
        ) : null}
      </Suspense>
    </div>
  );
}
