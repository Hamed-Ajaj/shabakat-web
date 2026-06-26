import { useEffect, useRef, useState } from "react";
import { MessageCircle, QrCode, RefreshCw, Unplug } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { useAuth } from "../../../providers/AuthProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";
import { useConnectWhatsAppMutation, useDisconnectWhatsAppMutation } from "../whatsappMutations";
import { useWhatsAppStatusQuery } from "../whatsappQueries";

const WHATSAPP_POLL_INTERVAL_MS = 2500;
const WHATSAPP_POLL_TIMEOUT_MS = 60_000;
const WHATSAPP_IDLE_POLL_INTERVAL_MS = 3000;

type WhatsAppFlowState = "idle" | "waiting-for-scan" | "waiting-for-confirmation" | "connected" | "timeout";

export default function WhatsAppConnectionPage() {
  const { session } = useAuth();
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
    : "Not checked yet";

  useEffect(() => {
    if (status === "open") {
      if (activeAttemptId !== null && notifiedAttemptIdRef.current !== activeAttemptId) {
        toast.success("Connected");
        notifiedAttemptIdRef.current = activeAttemptId;
      }

      setActiveAttemptId(null);
      setPollStartedAt(null);
      setFlowState("connected");
      setQrCode("");
      setConnectMessage("Connected");
      return;
    }

    if (!shouldPollStatus || pollStartedAt === null) {
      return;
    }

    if (Date.now() - pollStartedAt >= WHATSAPP_POLL_TIMEOUT_MS) {
      setActiveAttemptId(null);
      setPollStartedAt(null);
      setFlowState("timeout");
      setConnectMessage("Connection timed out. Generate a new QR and try again.");
      toast.error("WhatsApp connection timed out.");
      return;
    }

    if (status === "connecting") {
      setFlowState("waiting-for-confirmation");
      setConnectMessage("Waiting for confirmation...");
      return;
    }

    if (status === "close" && !qrCode) {
      setFlowState("waiting-for-confirmation");
      setConnectMessage("Waiting for confirmation...");
    }
  }, [activeAttemptId, pollStartedAt, qrCode, shouldPollStatus, status]);

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
        setConnectMessage("Scan QR with WhatsApp");
      } else {
        setFlowState("waiting-for-confirmation");
        setConnectMessage("Waiting for confirmation...");
      }

      const latestStatus = await statusQuery.refetch();
      const nextStatus = normalizeWhatsAppState(latestStatus.data?.state);

      if (nextStatus === "open") {
        setActiveAttemptId(null);
        setPollStartedAt(null);
        setFlowState("connected");
        setQrCode("");
        setConnectMessage("Connected");
        toast.success("Connected");
        notifiedAttemptIdRef.current = attemptId;
        return;
      }

      if (nextStatus === "connecting" || !response.qrCode.trim()) {
        setFlowState("waiting-for-confirmation");
        setConnectMessage("Waiting for confirmation...");
      }
    } catch (error) {
      setActiveAttemptId(null);
      setPollStartedAt(null);
      setFlowState("idle");
      setQrCode("");
      setConnectMessage("");
      toast.error(error instanceof Error ? error.message : "Failed to generate WhatsApp QR code.");
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
      toast.error(error instanceof Error ? error.message : "Failed to disconnect WhatsApp.");
    }
  }

  return (
    <SettingsScaffold title="WhatsApp Connection">
      <div className="space-y-6">
        <div className="rounded-[24px] border border-black/6 bg-background/70 p-4 dark:border-white/8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">WhatsApp session</p>
                  <p className="text-xs text-muted-foreground">Evolution API connection for automated reminders</p>
                </div>
              </div>

              {statusQuery.isLoading ? <StatusSkeleton /> : null}

              {!statusQuery.isLoading && statusQuery.error instanceof Error ? (
                <p className="text-sm text-red-300">{statusQuery.error.message}</p>
              ) : null}

              {!statusQuery.isLoading && !statusQuery.error ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatusCard
                    label="State"
                    value={<StatusBadge state={status} />}
                    description={getStateDescription(status)}
                  />
                  <StatusCard
                    label="Instance"
                    value={<span className="text-sm font-medium text-foreground">{statusQuery.data?.instanceName ?? "Unknown"}</span>}
                    description="Configured Evolution instance"
                  />
                  <StatusCard
                    label="Last checked"
                    value={<span className="text-sm font-medium text-foreground">{lastCheckedLabel}</span>}
                    description={shouldPollStatus ? "Polling every 2.5 seconds" : "Polling every 3 seconds"}
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
                Refresh
              </Button>
              <Button
                type="button"
                onClick={handleGenerateQr}
                disabled={!canConnect || connectMutation.isPending}
              >
                <QrCode className="h-4 w-4" />
                {connectMutation.isPending ? "Generating..." : "Generate QR"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDisconnect}
                disabled={!canDisconnect || disconnectMutation.isPending || status !== "open"}
              >
                <Unplug className="h-4 w-4" />
                {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
              </Button>
            </div>
          </div>

          {!canConnect ? (
            <p className="mt-4 text-sm text-muted-foreground">Only Owner and Admin can generate a QR code. Only Owner can disconnect a live session.</p>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-black/6 bg-background/70 p-4 dark:border-white/8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <QrCode className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Scan QR Code</p>
              <p className="text-xs text-muted-foreground">Open WhatsApp on the phone and scan to connect this generator account.</p>
            </div>
          </div>

          {qrCode ? (
            <div className="space-y-4">
              <div className="mx-auto flex w-full items-center justify-center rounded-[28px] border border-black/6 bg-white p-5 dark:border-white/8">
                <img
                  key={qrImageKey}
                  src={qrCode}
                  alt="WhatsApp QR code"
                  className="h-full w-full max-w-[280px] rounded-2xl object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground">{connectMessage || "Scan QR with WhatsApp"}</p>
            </div>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-black/8 bg-black/[0.015] px-6 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <QrCode className="mb-4 h-10 w-10 text-primary" />
              <p className="text-sm font-medium text-foreground">
                {getQrPanelTitle(status, flowState)}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {getQrPanelDescription(status, flowState, connectMessage)}
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
  if (state === "open") {
    return <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">Connected</Badge>;
  }

  if (state === "connecting") {
    return <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300">Connecting</Badge>;
  }

  if (state === "close") {
    return <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300">Disconnected</Badge>;
  }

  return <Badge variant="outline">Unknown</Badge>;
}

function normalizeWhatsAppState(state?: string) {
  if (state === "open" || state === "close" || state === "connecting") {
    return state;
  }

  return "unknown";
}

function getStateDescription(state: ReturnType<typeof normalizeWhatsAppState>) {
  if (state === "open") {
    return "Reminders can be sent from this linked WhatsApp session";
  }

  if (state === "connecting") {
    return "Waiting for scan or final pairing confirmation";
  }

  if (state === "close") {
    return "No active linked session right now";
  }

  return "Backend returned an unrecognized connection state";
}

function getQrPanelTitle(
  status: ReturnType<typeof normalizeWhatsAppState>,
  flowState: WhatsAppFlowState,
) {
  if (status === "open" || flowState === "connected") {
    return "Connected";
  }

  if (flowState === "waiting-for-confirmation") {
    return "Waiting for confirmation...";
  }

  if (flowState === "timeout") {
    return "Connection timed out";
  }

  if (flowState === "waiting-for-scan") {
    return "Scan QR with WhatsApp";
  }

  return "No QR code generated yet";
}

function getQrPanelDescription(
  status: ReturnType<typeof normalizeWhatsAppState>,
  flowState: WhatsAppFlowState,
  connectMessage: string,
) {
  if (status === "open" || flowState === "connected") {
    return "This WhatsApp session is active and ready for automated reminders.";
  }

  if (flowState === "timeout") {
    return connectMessage || "Generate a new QR and try again.";
  }

  if (flowState === "waiting-for-confirmation") {
    return connectMessage || "Waiting for confirmation...";
  }

  if (flowState === "waiting-for-scan") {
    return connectMessage || "Scan QR with WhatsApp";
  }

  return "Press Generate QR, then scan it from the WhatsApp mobile app.";
}
