import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useI18n } from "../../../providers/I18nProvider";
import { SITE_CONFIG } from "../lib/config";
import { usePageMeta } from "../lib/pageMeta";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  company: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email."),
  phone: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Subject is required."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.output<typeof contactSchema>;

export default function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  usePageMeta({ title: t("contact.seo.title"), description: t("contact.seo.description"), path: "/contact" });

  const form = useForm<ContactFormValues>({
    resolver: standardSchemaResolver(contactSchema),
    defaultValues: { name: "", company: "", email: "", phone: "", subject: "", message: "" },
  });

  function handleSubmit(values: ContactFormValues) {
    const body = [values.subject, values.name, values.company ? `Company: ${values.company}` : "", values.phone ? `Phone: ${values.phone}` : "", values.email, "", values.message]
      .filter(Boolean)
      .join("\n");

    const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(body)}`;
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const methods = [
    { icon: Mail, label: t("contact.methods.email"), value: SITE_CONFIG.supportEmail, href: `mailto:${SITE_CONFIG.supportEmail}` },
    { icon: Phone, label: t("contact.methods.phone"), value: SITE_CONFIG.supportPhone, href: `tel:${SITE_CONFIG.supportPhone}` },
    { icon: MessageCircle, label: t("contact.methods.whatsapp"), value: SITE_CONFIG.whatsappNumber, href: `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/\D/g, "")}` },
    { icon: MapPin, label: t("contact.methods.address"), value: SITE_CONFIG.businessAddress, href: null },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#F5C000]">{t("contact.eyebrow")}</p>
        <h1 className="mt-3 text-4xl font-bold text-[#F0F0F8]">{t("contact.title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[#7A7A9A]">{t("contact.subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {methods.map((method) => {
          const Icon = method.icon;
          const inner = (
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#13131F] p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5C000]/10 text-[#F5C000]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.14em] text-[#7A7A9A]">{method.label}</p>
                <p className="mt-1 truncate text-sm font-medium text-[#F0F0F8]">{method.value}</p>
              </div>
            </div>
          );
          return method.href ? (
            <a key={method.label} href={method.href} className="transition hover:border-[#F5C000]/30">
              {inner}
            </a>
          ) : (
            <div key={method.label}>{inner}</div>
          );
        })}
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-[#13131F] p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-[#F0F0F8]">{t("contact.form.title")}</h2>
        <p className="mt-1 text-sm text-[#7A7A9A]">{t("contact.form.help")}</p>

        {sent ? (
          <div className="mt-6 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 p-5 text-sm text-[#F0F0F8]">
            {t("contact.form.success")}
          </div>
        ) : (
          <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={form.handleSubmit(handleSubmit)}>
            <Field label={t("contact.form.name")} error={form.formState.errors.name?.message}>
              <Input className="h-11 rounded-xl border-white/10 bg-white/5 text-[#F0F0F8]" placeholder={t("contact.form.name")} {...form.register("name")} />
            </Field>
            <Field label={t("contact.form.company")} error={form.formState.errors.company?.message}>
              <Input className="h-11 rounded-xl border-white/10 bg-white/5 text-[#F0F0F8]" placeholder={t("contact.form.companyOptional")} {...form.register("company")} />
            </Field>
            <Field label={t("contact.form.email")} error={form.formState.errors.email?.message}>
              <Input className="h-11 rounded-xl border-white/10 bg-white/5 text-[#F0F0F8]" type="email" placeholder={t("contact.form.email")} {...form.register("email")} />
            </Field>
            <Field label={t("contact.form.phone")} error={form.formState.errors.phone?.message}>
              <Input className="h-11 rounded-xl border-white/10 bg-white/5 text-[#F0F0F8]" placeholder={t("contact.form.phoneOptional")} {...form.register("phone")} />
            </Field>
            <Field label={t("contact.form.subject")} error={form.formState.errors.subject?.message}>
              <Input className="h-11 rounded-xl border-white/10 bg-white/5 text-[#F0F0F8]" placeholder={t("contact.form.subject")} {...form.register("subject")} />
            </Field>
            <Field label={t("contact.form.message")} error={form.formState.errors.message?.message}>
              <Textarea className="min-h-32 rounded-xl border-white/10 bg-white/5 text-[#F0F0F8]" placeholder={t("contact.form.message")} {...form.register("message")} />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" className="h-11 rounded-xl bg-[#F5C000] px-6 font-semibold text-[#0B0B15] hover:bg-[#E6C43A]">
                {t("contact.form.submit")}
              </Button>
            </div>
          </form>
        )}
      </div>

      <p className="mt-8 text-sm text-[#7A7A9A]">{t("contact.responseNote")}</p>
      <p className="mt-2 text-sm text-[#7A7A9A]">{t("contact.appUsersNote")}</p>
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
