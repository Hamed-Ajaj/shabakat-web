import { Eye, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useI18n } from "../../../providers/I18nProvider";

interface AmpereScheduleRowActionsProps {
  canManage: boolean;
  canBeDeleted: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onView: () => void;
}

export function AmpereScheduleRowActions({
  canManage,
  canBeDeleted,
  onDelete,
  onEdit,
  onView,
}: Readonly<AmpereScheduleRowActionsProps>) {
  const { isRtl, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-lg text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-44">
        <DropdownMenuItem onClick={onView}>
          <Eye className="h-4 w-4" />
          {t("ampereSchedules.actions.viewDetails")}
        </DropdownMenuItem>
        {canManage ? (
          <DropdownMenuItem onClick={onEdit}>
            <PencilLine className="h-4 w-4" />
            {t("ampereSchedules.actions.edit")}
          </DropdownMenuItem>
        ) : null}
        {canManage && canBeDeleted ? (
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            {t("ampereSchedules.actions.delete")}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
