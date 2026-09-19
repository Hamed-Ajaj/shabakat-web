import { Mail, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { useI18n } from "../../../providers/I18nProvider";
import { SITE_CONFIG } from "../lib/config";

export function RequestAccessDialog({ open, onOpenChange }: Readonly<{ open: boolean; onOpenChange: (open: boolean) => void }>) {
  const { t } = useI18n();
  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/\D/g, "")}`;
  const mailHref = `mailto:${SITE_CONFIG.supportEmail}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#13131F] text-[#F0F0F8]">
        <DialogHeader>
          <DialogTitle>{t("marketing.access.title")}</DialogTitle>
          <DialogDescription className="text-[#7A7A9A]">{t("marketing.access.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:border-[#25D366]/40 hover:bg-white/[0.08]"
          >
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            {t("marketing.access.whatsapp")}
          </a>
          <a
            href={mailHref}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:border-[#F5C000]/40 hover:bg-white/[0.08]"
          >
            <Mail className="h-5 w-5 text-[#F5C000]" />
            {t("marketing.access.email")}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
