import { useI18n } from "../../../providers/I18nProvider";
import { LegalLayout } from "../components/LegalLayout";
import { termsContent } from "../lib/legalContent";
import { usePageMeta } from "../lib/pageMeta";

export default function TermsPage() {
  const { locale, t } = useI18n();
  const sections = termsContent[locale];

  usePageMeta({ title: t("terms.seo.title"), description: t("terms.seo.description"), path: "/terms" });

  return (
    <LegalLayout
      title={t("terms.title")}
      effectiveDate={t("terms.effectiveDate")}
      sections={sections}
    />
  );
}
