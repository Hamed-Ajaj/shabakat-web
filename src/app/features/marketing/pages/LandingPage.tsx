import {
  AppWindow,
  ArrowRight,
  Check,
  FileText,
  Gauge,
  Lock,
  Monitor,
  ReceiptText,
  Smartphone,
  WifiOff,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { useI18n } from "../../../providers/I18nProvider";
import { RequestAccessDialog } from "../components/RequestAccessDialog";
import { usePageMeta } from "../lib/pageMeta";
import { featureIcons, landingContent, type LandingContent } from "../lib/landingContent";

const planIcons = [Zap, Gauge, ReceiptText];
const platformIcons = [Monitor, Smartphone, AppWindow];

export default function LandingPage() {
  const { locale, t } = useI18n();
  const content = landingContent[locale];
  const [requestOpen, setRequestOpen] = useState(false);

  usePageMeta({
    title: t("marketing.seo.title"),
    description: t("marketing.seo.description"),
    path: "/",
  });

  return (
    <div className="overflow-hidden">
      <Hero content={content} onRequest={() => setRequestOpen(true)} />

      <StatsStrip items={content.stats} />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Problem content={content} />
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow={t("marketing.features.eyebrow")} title={t("marketing.features.title")} subtitle={t("marketing.features.subtitle")} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((feature, index) => {
            const Icon = featureIcons[index % featureIcons.length];
            return (
              <div key={feature.title} className="rounded-2xl border border-white/10 bg-[#13131F] p-6 transition hover:border-[#F5C000]/30">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C000]/10 text-[#F5C000]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F0F0F8]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7A7A9A]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="plans" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow={t("marketing.plans.eyebrow")} title={t("marketing.plans.title")} subtitle={t("marketing.plans.subtitle")} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {content.plans.map((plan, index) => {
            const Icon = planIcons[index];
            return (
              <div key={plan.title} className="rounded-2xl border border-white/10 bg-[#13131F] p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C000]/10 text-[#F5C000]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F0F0F8]">{plan.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7A7A9A]">{plan.description}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-[#7A7A9A]">{t("marketing.plans.note")}</p>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow={t("marketing.how.eyebrow")} title={t("marketing.how.title")} subtitle={t("marketing.how.subtitle")} />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.how.map((step, index) => (
            <li key={step.title} className="relative rounded-2xl border border-white/10 bg-[#13131F] p-6">
              <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5C000] text-sm font-bold text-[#0B0B15]">
                {index + 1}
              </span>
              <h3 className="text-base font-semibold text-[#F0F0F8]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7A7A9A]">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading eyebrow={t("marketing.platform.eyebrow")} title={t("marketing.platform.title")} subtitle={t("marketing.platform.subtitle")} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {content.platform.map((platform, index) => {
            const Icon = platformIcons[index];
            return (
              <div key={platform.title} className="rounded-2xl border border-white/10 bg-[#13131F] p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C000]/10 text-[#F5C000]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F0F0F8]">{platform.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7A7A9A]">{platform.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-10 rounded-[32px] border border-white/10 bg-[#13131F] p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-[#F0F0F8]">{content.offline.heading}</h2>
            <p className="mt-4 text-[#7A7A9A]">{content.offline.body}</p>
            <ul className="mt-6 space-y-3">
              {content.offline.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm text-[#A8A8C0]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F5C000]" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex h-64 items-center justify-center rounded-2xl bg-[#F5C000]/5">
            <WifiOff className="h-16 w-16 text-[#F5C000]/60" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-[#13131F] p-8 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5C000]/10 text-[#F5C000]">
            <Lock className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#F0F0F8]">{content.security.heading}</h2>
            <p className="mt-1 text-sm text-[#7A7A9A]">{content.security.body}</p>
          </div>
          <a href="/privacy" className="text-sm font-medium text-[#F5C000] hover:underline">
            {t("marketing.security.link")} <ArrowRight className="inline h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#F0F0F8]">{content.pricing.heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#7A7A9A]">{content.pricing.body}</p>
          <Button onClick={() => setRequestOpen(true)} className="mt-6 h-11 rounded-xl bg-[#F5C000] px-6 font-semibold text-[#0B0B15] hover:bg-[#E6C43A]">
            {t("marketing.cta.requestAccess")}
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <SectionHeading title={t("marketing.faq.title")} />
        <Accordion type="single" collapsible className="mt-10 w-full">
          {content.faq.map((item, index) => (
            <AccordionItem key={item.title} value={`faq-${index}`} className="border-b border-white/10">
              <AccordionTrigger className="py-4 text-start text-base font-medium text-[#F0F0F8] hover:no-underline">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-[#7A7A9A]">
                {item.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <FinalCta heading={content.finalCta.heading} onRequest={() => setRequestOpen(true)} />

      <RequestAccessDialog open={requestOpen} onOpenChange={setRequestOpen} />
    </div>
  );
}

function Hero({ content, onRequest }: Readonly<{ content: LandingContent; onRequest: () => void }>) {
  const { t } = useI18n();

  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-96 max-w-4xl rounded-full bg-[#F5C000]/10 blur-3xl" />
      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="inline-flex rounded-full border border-[#F5C000]/30 bg-[#F5C000]/10 px-3 py-1 text-xs font-medium text-[#F5C000]">
            {content.hero.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-[#F0F0F8] sm:text-5xl">{content.hero.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-[#A8A8C0]">{content.hero.subtitle}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={onRequest} className="h-12 rounded-xl bg-[#F5C000] px-6 font-semibold text-[#0B0B15] hover:bg-[#E6C43A]">
              {t("marketing.cta.requestAccess")}
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl border-white/10 bg-transparent px-6 text-[#F0F0F8] hover:bg-white/5">
              <a href="#how-it-works">{t("marketing.cta.seeHowItWorks")}</a>
            </Button>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
            {content.hero.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2 text-sm text-[#A8A8C0]">
                <Check className="h-4 w-4 text-[#F5C000]" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative flex h-72 w-full max-w-lg items-center justify-center rounded-[32px] border border-white/10 bg-gradient-to-br from-[#13131F] to-[#0B0B15] p-8">
            <div className="grid grid-cols-3 items-end gap-3">
              <div className="h-40 w-24 rounded-xl border border-white/10 bg-[#1A1A2E]" />
              <div className="h-56 w-28 rounded-xl border border-white/10 bg-[#1A1A2E]" />
              <div className="h-44 w-24 rounded-xl border border-white/10 bg-[#1A1A2E]" />
            </div>
            <div className="absolute inset-0 rounded-[32px] bg-[#F5C000]/5" />
            <Zap className="absolute h-12 w-12 text-[#F5C000]" fill="currentColor" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip({ items }: Readonly<{ items: string[] }>) {
  return (
    <section className="border-y border-white/10 bg-[#0B0B15]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-center px-6 py-6 text-center text-sm text-[#A8A8C0]">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function Problem({ content }: Readonly<{ content: LandingContent }>) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <h2 className="text-3xl font-bold text-[#F0F0F8]">{content.problem.heading}</h2>
        <p className="mt-4 max-w-xl text-[#7A7A9A]">{content.problem.body}</p>
      </div>
      <div className="flex h-56 items-center justify-center rounded-2xl border border-white/10 bg-[#13131F]">
        <FileText className="h-14 w-14 text-[#F5C000]/50" />
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: Readonly<{ eyebrow?: string; title: string; subtitle?: string }>) {
  return (
    <div className="text-center">
      {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#F5C000]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-bold text-[#F0F0F8]">{title}</h2>
      {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-[#7A7A9A]">{subtitle}</p> : null}
    </div>
  );
}

function FinalCta({ heading, onRequest }: Readonly<{ heading: string; onRequest: () => void }>) {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <div className="relative overflow-hidden rounded-[32px] border border-[#F5C000]/20 bg-[#13131F] px-8 py-16 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 max-w-2xl rounded-full bg-[#F5C000]/10 blur-3xl" />
        <h2 className="relative text-3xl font-bold text-[#F0F0F8]">{heading}</h2>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={onRequest} className="h-12 rounded-xl bg-[#F5C000] px-6 font-semibold text-[#0B0B15] hover:bg-[#E6C43A]">
            {t("marketing.cta.requestAccess")}
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-xl border-white/10 bg-transparent px-6 text-[#F0F0F8] hover:bg-white/5">
            <a href="/contact">{t("marketing.cta.contactUs")}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
