import { useI18n } from "../../../providers/I18nProvider";
import { LegalLayout } from "../components/LegalLayout";
import { privacyContent } from "../lib/legalContent";
import { usePageMeta } from "../lib/pageMeta";

export default function PrivacyPolicyPage() {
  const { locale, t } = useI18n();
  const sections = privacyContent[locale];

  usePageMeta({ title: t("privacy.seo.title"), description: t("privacy.seo.description"), path: "/privacy" });

  return (
    <LegalLayout
      title={t("privacy.title")}
      effectiveDate={t("privacy.effectiveDate")}
      intro={t("privacy.intro")}
      sections={sections}
    />
  );
}
