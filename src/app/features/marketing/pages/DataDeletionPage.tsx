import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useI18n } from "../../../providers/I18nProvider";
import { SITE_CONFIG } from "../lib/config";
import { usePageMeta } from "../lib/pageMeta";

const deletionSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email."),
  company: z.string().trim().min(1, "Company name is required."),
  reason: z.string().trim().optional().or(z.literal("")),
  confirm: z.boolean().refine((value) => value === true, "You must confirm the request."),
});

type DeletionFormValues = z.output<typeof deletionSchema>;

export default function DataDeletionPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  usePageMeta({ title: t("deletion.seo.title"), description: t("deletion.seo.description"), path: "/data-deletion" });

  const form = useForm<DeletionFormValues>({
    resolver: standardSchemaResolver(deletionSchema),
    defaultValues: { email: "", company: "", reason: "", confirm: false },
  });

  function handleSubmit(values: DeletionFormValues) {
    const body = [t("deletion.form.email"), values.email, t("deletion.form.company"), values.company, values.reason ? `${t("deletion.form.reason")}: ${values.reason}` : ""]
      .filter(Boolean)
      .join("\n");
    const mailHref = `mailto:${SITE_CONFIG.supportEmail}?subject=${encodeURIComponent(t("deletion.form.subject"))}&body=${encodeURIComponent(body)}`;
    window.location.href = mailHref;
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <h1 className="text-3xl font-bold text-[#F0F0F8]">{t("deletion.title")}</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#7A7A9A]">{t("deletion.intro")}</p>

      <div className="mt-6 rounded-xl border border-white/10 bg-[#13131F] p-5 text-sm text-[#A8A8C0]">
        <p>{t("deletion.whatHappens")}</p>
        <p className="mt-2">{t("deletion.retained")}</p>
        <p className="mt-2">{t("deletion.timeframe")}</p>
      </div>

      {sent ? (
        <div className="mt-8 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 p-5 text-sm text-[#F0F0F8]">
          {t("deletion.success")}
        </div>
      ) : (
        <form className="mt-8 grid gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <Field label={t("deletion.form.email")} error={form.formState.errors.email?.message}>
            <Input className="h-11 rounded-xl border-white/10 bg-white/5 text-[#F0F0F8]" type="email" {...form.register("email")} />
          </Field>
          <Field label={t("deletion.form.company")} error={form.formState.errors.company?.message}>
            <Input className="h-11 rounded-xl border-white/10 bg-white/5 text-[#F0F0F8]" {...form.register("company")} />
          </Field>
          <Field label={t("deletion.form.reason")} error={form.formState.errors.reason?.message}>
            <Textarea className="min-h-28 rounded-xl border-white/10 bg-white/5 text-[#F0F0F8]" {...form.register("reason")} />
          </Field>

          <label className="flex items-start gap-3">
            <Checkbox
              className="mt-0.5 border-white/20 data-[state=checked]:bg-[#F5C000] data-[state=checked]:text-[#0B0B15]"
              checked={form.watch("confirm")}
              onCheckedChange={(checked) => form.setValue("confirm", Boolean(checked))}
            />
            <span className="text-sm text-[#A8A8C0]">{t("deletion.form.confirm")}</span>
          </label>
          {form.formState.errors.confirm ? <p className="text-sm text-[#EF4444]">{form.formState.errors.confirm.message}</p> : null}

          <Button type="submit" className="h-11 rounded-xl bg-[#F5C000] px-6 font-semibold text-[#0B0B15] hover:bg-[#E6C43A]">
            {t("deletion.form.submit")}
          </Button>
        </form>
      )}
    </div>
  );
}

function Field({ label, error, children }: Readonly<{ label: string; error?: string; children: React.ReactNode }>) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[#F0F0F8]">{label}</span>
      {children}
      {error ? <span className="block text-sm text-[#EF4444]">{error}</span> : null}
    </label>
  );
}
