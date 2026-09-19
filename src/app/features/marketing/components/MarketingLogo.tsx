import { Zap } from "lucide-react";
import { useI18n } from "../../../providers/I18nProvider";

export function MarketingLogo() {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C000] text-[#0B0B15]"
        style={{ boxShadow: "0 0 20px rgba(245,192,0,0.35)" }}
      >
        <Zap className="h-5 w-5" fill="currentColor" />
      </div>
      <div>
        <p className="text-base font-bold leading-tight text-[#F0F0F8]">{t("marketing.brand.name")}</p>
        <p className="text-xs leading-tight text-[#7A7A9A]">{t("marketing.brand.tagline")}</p>
      </div>
    </div>
  );
}
