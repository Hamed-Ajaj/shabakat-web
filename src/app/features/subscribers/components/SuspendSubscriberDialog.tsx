import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { useI18n } from "../../../providers/I18nProvider";
import { useSuspendSubscriberMutation } from "../mutations";

interface SuspendSubscriberDialogProps {
  open: boolean;
  subscriberId: string | null;
  subscriberName: string;
  onOpenChange: (open: boolean) => void;
}

export function SuspendSubscriberDialog({
  open,
  subscriberId,
  subscriberName,
  onOpenChange,
}: Readonly<SuspendSubscriberDialogProps>) {
  const { t } = useI18n();
  const suspendSubscriber = useSuspendSubscriberMutation();

  async function handleSuspend() {
    if (!subscriberId) return;
    await suspendSubscriber.mutateAsync(subscriberId);
    toast.success(t("subscribers.suspend.success", { name: subscriberName }));
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("subscribers.suspend.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("subscribers.suspend.description", { name: subscriberName })}</AlertDialogDescription>
        </AlertDialogHeader>
        {suspendSubscriber.error instanceof Error ? <p className="text-sm text-red-300">{suspendSubscriber.error.message}</p> : null}
        <AlertDialogFooter>
          <AlertDialogCancel>{t("subscribers.actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={(event) => { event.preventDefault(); void handleSuspend(); }}>
            {suspendSubscriber.isPending ? t("subscribers.actions.suspending") : t("subscribers.actions.suspend")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
