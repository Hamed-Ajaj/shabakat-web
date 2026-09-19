import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../providers/I18nProvider";
import { RequestAccessDialog } from "../components/RequestAccessDialog";
import { usePageMeta } from "../lib/pageMeta";

export default function AboutPage() {
  const { t } = useI18n();

  usePageMeta({ title: t("about.seo.title"), description: t("about.seo.description"), path: "/about" });

  const values = ["about.values.reliability", "about.values.clarity", "about.values.local", "about.values.privacy"] as const;
  const audiences = ["about.who.neighborhood", "about.who.building", "about.who.distributors", "about.who.teams"] as const;

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#F5C000]">{t("about.eyebrow")}</p>
        <h1 className="mt-3 text-4xl font-bold text-[#F0F0F8]">{t("about.hero.title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[#7A7A9A]">{t("about.hero.body")}</p>
      </div>

      <div className="mt-14 space-y-6 text-[#A8A8C0]">
        <p>{t("about.story.one")}</p>
        <p>{t("about.story.two")}</p>
        <p>{t("about.story.three")}</p>
      </div>

      <div className="mt-14 rounded-2xl border border-[#F5C000]/20 bg-[#13131F] p-8 text-center">
        <h2 className="text-xl font-semibold text-[#F0F0F8]">{t("about.mission.title")}</h2>
        <p className="mt-3 text-lg text-[#F5C000]">{t("about.mission.body")}</p>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-[#F0F0F8]">{t("about.who.title")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {audiences.map((audience) => (
            <div key={audience} className="rounded-xl border border-white/10 bg-[#13131F] p-5">
              <p className="text-sm text-[#A8A8C0]">{t(audience)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-[#F0F0F8]">{t("about.values.title")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {values.map((value) => (
            <div key={value} className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#13131F] p-5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F5C000]" />
              <p className="text-sm text-[#A8A8C0]">{t(value)}</p>
            </div>
          ))}
        </div>
      </section>

      <AboutCta />
    </div>
  );
}

function AboutCta() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-20 rounded-2xl border border-white/10 bg-[#13131F] p-8 text-center">
      <h2 className="text-2xl font-bold text-[#F0F0F8]">{t("about.cta.title")}</h2>
      <Button onClick={() => setOpen(true)} className="mt-5 h-11 rounded-xl bg-[#F5C000] px-6 font-semibold text-[#0B0B15] hover:bg-[#E6C43A]">
        {t("marketing.cta.requestAccess")}
      </Button>
      <RequestAccessDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
