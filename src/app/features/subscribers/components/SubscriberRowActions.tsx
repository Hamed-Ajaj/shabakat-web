import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../providers/I18nProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

interface SubscriberRowActionsProps {
  canDelete: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onView: () => void;
}

export function SubscriberRowActions({
  canDelete,
  onDelete,
  onEdit,
  onView,
}: Readonly<SubscriberRowActionsProps>) {
  const { isRtl, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          aria-label={t("subscribers.actions.more")}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-44">
        <DropdownMenuItem onClick={onView}>
          <Eye className="h-4 w-4" />
          {t("subscribers.actions.viewDetails")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="h-4 w-4" />
          {t("subscribers.actions.edit")}
        </DropdownMenuItem>
        {canDelete ? (
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            {t("subscribers.actions.delete")}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
