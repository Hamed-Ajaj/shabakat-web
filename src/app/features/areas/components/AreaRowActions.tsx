import { Eye, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../providers/I18nProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

interface AreaRowActionsProps {
  canManage: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onView: () => void;
}

export function AreaRowActions({
  canManage,
  onDelete,
  onEdit,
  onView,
}: Readonly<AreaRowActionsProps>) {
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
          {t("areas.actions.viewDetails")}
        </DropdownMenuItem>
        {canManage ? (
          <DropdownMenuItem onClick={onEdit}>
            <PencilLine className="h-4 w-4" />
            {t("areas.actions.edit")}
          </DropdownMenuItem>
        ) : null}
        {canManage ? (
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            {t("areas.actions.delete")}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
