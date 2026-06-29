import { useEffect, useRef, useState } from "react";
import { MessageCircle, QrCode, RefreshCw, Unplug } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";
import { useConnectWhatsAppMutation, useDisconnectWhatsAppMutation } from "../whatsappMutations";
import { useWhatsAppStatusQuery } from "../whatsappQueries";

const WHATSAPP_POLL_INTERVAL_MS = 2500;
const WHATSAPP_POLL_TIMEOUT_MS = 60_000;
const WHATSAPP_IDLE_POLL_INTERVAL_MS = 3000;

type WhatsAppFlowState = "idle" | "waiting-for-scan" | "waiting-for-confirmation" | "connected" | "timeout";

export default function WhatsAppConnectionPage() {
  const { session } = useAuth();
  const { t } = useI18n();
  const connectMutation = useConnectWhatsAppMutation();
  const disconnectMutation = useDisconnectWhatsAppMutation();
  const [qrCode, setQrCode] = useState("");
  const [qrImageKey, setQrImageKey] = useState(0);
  const [connectMessage, setConnectMessage] = useState("");
  const [flowState, setFlowState] = useState<WhatsAppFlowState>("idle");
  const [activeAttemptId, setActiveAttemptId] = useState<number | null>(null);
  const [pollStartedAt, setPollStartedAt] = useState<number | null>(null);
  const canConnect = session?.role === "Owner" || session?.role === "Admin";
  const canDisconnect = session?.role === "Owner";
  const nextAttemptIdRef = useRef(0);
  const notifiedAttemptIdRef = useRef<number | null>(null);
  const shouldPollStatus = activeAttemptId !== null && flowState !== "connected" && flowState !== "timeout";
  const statusQuery = useWhatsAppStatusQuery({
    refetchInterval: shouldPollStatus ? WHATSAPP_POLL_INTERVAL_MS : WHATSAPP_IDLE_POLL_INTERVAL_MS,
  });
  const status = normalizeWhatsAppState(statusQuery.data?.state);
  const lastCheckedLabel = statusQuery.dataUpdatedAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(statusQuery.dataUpdatedAt)
    : t("settings.whatsapp.notChecked");

  useEffect(() => {
    if (status === "open") {
      if (activeAttemptId !== null && notifiedAttemptIdRef.current !== activeAttemptId) {
        toast.success(t("settings.whatsapp.status.connected"));
        notifiedAttemptIdRef.current = activeAttemptId;
      }

      setActiveAttemptId(null);
      setPollStartedAt(null);
      setFlowState("connected");
      setQrCode("");
      setConnectMessage(t("settings.whatsapp.status.connected"));
      return;
    }

    if (!shouldPollStatus || pollStartedAt === null) {
      return;
    }

    if (Date.now() - pollStartedAt >= WHATSAPP_POLL_TIMEOUT_MS) {
      setActiveAttemptId(null);
      setPollStartedAt(null);
      setFlowState("timeout");
      setConnectMessage(t("settings.whatsapp.qr.timeoutDescription"));
      toast.error(t("settings.whatsapp.qr.timeoutTitle"));
      return;
    }

    if (status === "connecting") {
      setFlowState("waiting-for-confirmation");
      setConnectMessage(t("settings.whatsapp.qr.waitingForConfirmation"));
      return;
    }

    if (status === "close" && !qrCode) {
      setFlowState("waiting-for-confirmation");
      setConnectMessage(t("settings.whatsapp.qr.waitingForConfirmation"));
    }
  }, [activeAttemptId, pollStartedAt, qrCode, shouldPollStatus, status, t]);

  async function handleGenerateQr() {
    const attemptId = nextAttemptIdRef.current + 1;
    nextAttemptIdRef.current = attemptId;
    notifiedAttemptIdRef.current = null;
    setActiveAttemptId(attemptId);
    setPollStartedAt(Date.now());
    setFlowState("idle");
    setQrCode("");
    setQrImageKey((current) => current + 1);
    setConnectMessage("");
    connectMutation.reset();

    try {
      const response = await connectMutation.mutateAsync();

      if (response.qrCode.trim()) {
        setQrCode(response.qrCode.trim());
        setQrImageKey(attemptId);
        setFlowState("waiting-for-scan");
        setConnectMessage(t("settings.whatsapp.qr.scanWithWhatsapp"));
      } else {
        setFlowState("waiting-for-confirmation");
        setConnectMessage(t("settings.whatsapp.qr.waitingForConfirmation"));
      }

      const latestStatus = await statusQuery.refetch();
      const nextStatus = normalizeWhatsAppState(latestStatus.data?.state);

      if (nextStatus === "open") {
        setActiveAttemptId(null);
        setPollStartedAt(null);
        setFlowState("connected");
        setQrCode("");
        setConnectMessage(t("settings.whatsapp.status.connected"));
        toast.success(t("settings.whatsapp.status.connected"));
        notifiedAttemptIdRef.current = attemptId;
        return;
      }

      if (nextStatus === "connecting" || !response.qrCode.trim()) {
        setFlowState("waiting-for-confirmation");
        setConnectMessage(t("settings.whatsapp.qr.waitingForConfirmation"));
      }
    } catch (error) {
      setActiveAttemptId(null);
      setPollStartedAt(null);
      setFlowState("idle");
      setQrCode("");
      setConnectMessage("");
      toast.error(error instanceof Error ? error.message : t("settings.whatsapp.error.generateQr"));
    }
  }

  async function handleDisconnect() {
    try {
      const response = await disconnectMutation.mutateAsync();
      setActiveAttemptId(null);
      setPollStartedAt(null);
      setFlowState("idle");
      setQrCode("");
      setConnectMessage("");
      toast.success(response.message);
      await statusQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("settings.whatsapp.error.disconnect"));
    }
  }

  return (
    <SettingsScaffold title={t("settings.title.whatsapp")}>
      <div className="space-y-6">
        <div className="rounded-[24px] border border-black/6 bg-background/70 p-4 dark:border-white/8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t("settings.whatsapp.sessionTitle")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.whatsapp.sessionDescription")}</p>
                </div>
              </div>

              {statusQuery.isLoading ? <StatusSkeleton /> : null}

              {!statusQuery.isLoading && statusQuery.error instanceof Error ? (
                <p className="text-sm text-red-300">{statusQuery.error.message}</p>
              ) : null}

              {!statusQuery.isLoading && !statusQuery.error ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatusCard
                    label={t("settings.whatsapp.card.state")}
                    value={<StatusBadge state={status} />}
                    description={getStateDescription(status, t)}
                  />
                  <StatusCard
                    label={t("settings.whatsapp.card.instance")}
                    value={<span className="text-sm font-medium text-foreground">{statusQuery.data?.instanceName ?? t("settings.whatsapp.status.unknown")}</span>}
                    description={t("settings.whatsapp.card.instanceDescription")}
                  />
                  <StatusCard
                    label={t("settings.whatsapp.card.lastChecked")}
                    value={<span className="text-sm font-medium text-foreground">{lastCheckedLabel}</span>}
                    description={shouldPollStatus ? t("settings.whatsapp.card.pollingActive") : t("settings.whatsapp.card.pollingIdle")}
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => statusQuery.refetch()}
                disabled={statusQuery.isFetching}
              >
                <RefreshCw className={statusQuery.isFetching ? "animate-spin" : ""} />
                {t("settings.whatsapp.actions.refresh")}
              </Button>
              <Button
                type="button"
                onClick={handleGenerateQr}
                disabled={!canConnect || connectMutation.isPending}
              >
                <QrCode className="h-4 w-4" />
                {connectMutation.isPending ? t("settings.whatsapp.actions.generating") : t("settings.whatsapp.actions.generateQr")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDisconnect}
                disabled={!canDisconnect || disconnectMutation.isPending || status !== "open"}
              >
                <Unplug className="h-4 w-4" />
                {disconnectMutation.isPending ? t("settings.whatsapp.actions.disconnecting") : t("settings.whatsapp.actions.disconnect")}
              </Button>
            </div>
          </div>

          {!canConnect ? (
            <p className="mt-4 text-sm text-muted-foreground">{t("settings.whatsapp.permissions")}</p>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-black/6 bg-background/70 p-4 dark:border-white/8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <QrCode className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t("settings.whatsapp.qr.title")}</p>
              <p className="text-xs text-muted-foreground">{t("settings.whatsapp.qr.description")}</p>
            </div>
          </div>

          {qrCode ? (
            <div className="space-y-4">
              <div className="mx-auto flex w-full items-center justify-center rounded-[28px] border border-black/6 bg-white p-5 dark:border-white/8">
                <img
                  key={qrImageKey}
                  src={qrCode}
                  alt={t("settings.whatsapp.qr.alt")}
                  className="h-full w-full max-w-[280px] rounded-2xl object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground">{connectMessage || t("settings.whatsapp.qr.scanWithWhatsapp")}</p>
            </div>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-black/8 bg-black/[0.015] px-6 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <QrCode className="mb-4 h-10 w-10 text-primary" />
              <p className="text-sm font-medium text-foreground">
                {getQrPanelTitle(status, flowState, t)}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {getQrPanelDescription(status, flowState, connectMessage, t)}
              </p>
            </div>
          )}
        </div>
      </div>
    </SettingsScaffold>
  );
}

function StatusSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-black/6 bg-card p-4 dark:border-white/8">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-5 w-24" />
          <Skeleton className="mt-3 h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

function StatusCard({
  label,
  value,
  description,
}: Readonly<{
  label: string;
  value: React.ReactNode;
  description: string;
}>) {
  return (
    <div className="rounded-2xl border border-black/6 bg-card p-4 dark:border-white/8">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <div className="mt-3">{value}</div>
      <p className="mt-3 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function StatusBadge({ state }: Readonly<{ state: "open" | "close" | "connecting" | "unknown" }>) {
  const { t } = useI18n();

  if (state === "open") {
    return <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">{t("settings.whatsapp.status.connected")}</Badge>;
  }

  if (state === "connecting") {
    return <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300">{t("settings.whatsapp.status.connecting")}</Badge>;
  }

  if (state === "close") {
    return <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300">{t("settings.whatsapp.status.disconnected")}</Badge>;
  }

  return <Badge variant="outline">{t("settings.whatsapp.status.unknown")}</Badge>;
}

function normalizeWhatsAppState(state?: string) {
  if (state === "open" || state === "close" || state === "connecting") {
    return state;
  }

  return "unknown";
}

function getStateDescription(state: ReturnType<typeof normalizeWhatsAppState>, t: (key: never) => string) {
  if (state === "open") {
    return t("settings.whatsapp.stateDescription.connected" as never);
  }

  if (state === "connecting") {
    return t("settings.whatsapp.stateDescription.connecting" as never);
  }

  if (state === "close") {
    return t("settings.whatsapp.stateDescription.disconnected" as never);
  }

  return t("settings.whatsapp.stateDescription.unknown" as never);
}

function getQrPanelTitle(
  status: ReturnType<typeof normalizeWhatsAppState>,
  flowState: WhatsAppFlowState,
  t: (key: never) => string,
) {
  if (status === "open" || flowState === "connected") {
    return t("settings.whatsapp.qr.connectedTitle" as never);
  }

  if (flowState === "waiting-for-confirmation") {
    return t("settings.whatsapp.qr.waitingForConfirmation" as never);
  }

  if (flowState === "timeout") {
    return t("settings.whatsapp.qr.timeoutTitle" as never);
  }

  if (flowState === "waiting-for-scan") {
    return t("settings.whatsapp.qr.scanWithWhatsapp" as never);
  }

  return t("settings.whatsapp.qr.noQrYet" as never);
}

function getQrPanelDescription(
  status: ReturnType<typeof normalizeWhatsAppState>,
  flowState: WhatsAppFlowState,
  connectMessage: string,
  t: (key: never) => string,
) {
  if (status === "open" || flowState === "connected") {
    return t("settings.whatsapp.qr.connectedDescription" as never);
  }

  if (flowState === "timeout") {
    return connectMessage || t("settings.whatsapp.qr.timeoutDescription" as never);
  }

  if (flowState === "waiting-for-confirmation") {
    return connectMessage || t("settings.whatsapp.qr.waitingForConfirmation" as never);
  }

  if (flowState === "waiting-for-scan") {
    return connectMessage || t("settings.whatsapp.qr.scanWithWhatsapp" as never);
  }

  return t("settings.whatsapp.qr.idleDescription" as never);
}
