import { Link } from "react-router-dom";
import { useI18n } from "../../../providers/I18nProvider";
import { SITE_CONFIG } from "../lib/config";
import { MarketingLogo } from "./MarketingLogo";

export function MarketingFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-white/10 bg-[#0B0B15]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <MarketingLogo />
            <p className="max-w-xs text-sm text-[#7A7A9A]">{t("marketing.brand.description")}</p>
          </div>

          <FooterColumn title={t("footer.product")}>
            <FooterLink to="/#features">{t("marketing.nav.features")}</FooterLink>
            <FooterLink to="/#how-it-works">{t("marketing.nav.howItWorks")}</FooterLink>
            <FooterLink to="/contact">{t("marketing.cta.requestAccess")}</FooterLink>
            <FooterLink to="/login">{t("marketing.nav.signIn")}</FooterLink>
          </FooterColumn>

          <FooterColumn title={t("footer.company")}>
            <FooterLink to="/about">{t("marketing.nav.about")}</FooterLink>
            <FooterLink to="/contact">{t("marketing.nav.contact")}</FooterLink>
          </FooterColumn>

          <FooterColumn title={t("footer.legal")}>
            <FooterLink to="/privacy">{t("footer.privacy")}</FooterLink>
            <FooterLink to="/terms">{t("footer.terms")}</FooterLink>
            <FooterLink to="/data-deletion">{t("footer.dataDeletion")}</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-[#7A7A9A] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.legalEntity}. {t("footer.rights")}
          </p>
          <p>{t("footer.note")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#F0F0F8]">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ to, children }: Readonly<{ to: string; children: React.ReactNode }>) {
  return (
    <Link to={to} className="text-sm text-[#7A7A9A] transition hover:text-[#F5C000]">
      {children}
    </Link>
  );
}
