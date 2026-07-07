import { Eye, MoreHorizontal, PencilLine } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useI18n } from "../../../providers/I18nProvider";

interface BoxRowActionsProps {
  canManage: boolean;
  onEdit: () => void;
  onView: () => void;
}

export function BoxRowActions({
  canManage,
  onEdit,
  onView,
}: Readonly<BoxRowActionsProps>) {
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
          {t("boxes.actions.viewDetails")}
        </DropdownMenuItem>
        {canManage ? (
          <DropdownMenuItem onClick={onEdit}>
            <PencilLine className="h-4 w-4" />
            {t("boxes.actions.edit")}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

