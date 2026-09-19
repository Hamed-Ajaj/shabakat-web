import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../../components/ui/sheet";
import { useI18n } from "../../../providers/I18nProvider";
import { MarketingLogo } from "./MarketingLogo";

const NAV_LINKS = [
  { to: "/about", labelKey: "marketing.nav.about" },
  { to: "/contact", labelKey: "marketing.nav.contact" },
] as const;

const SECTION_LINKS = [
  { to: "/#features", labelKey: "marketing.nav.features" },
  { to: "/#plans", labelKey: "marketing.nav.plans" },
  { to: "/#how-it-works", labelKey: "marketing.nav.howItWorks" },
] as const;

function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        type="button"
        className={`rounded-md px-2 py-1 transition ${locale === "en" ? "text-[#F5C000]" : "text-[#7A7A9A] hover:text-[#F0F0F8]"}`}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <span className="text-[#7A7A9A]">|</span>
      <button
        type="button"
        className={`rounded-md px-2 py-1 transition ${locale === "ar" ? "text-[#F5C000]" : "text-[#7A7A9A] hover:text-[#F0F0F8]"}`}
        onClick={() => setLocale("ar")}
      >
        AR
      </button>
    </div>
  );
}

export function MarketingHeader() {
  const { t } = useI18n();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  function handleSectionClick(to: string) {
    if (location.pathname !== "/") {
      window.location.assign(to);
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors ${
        scrolled ? "border-white/10 bg-[#0B0B15]/80" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" aria-label="Shabakat home">
          <MarketingLogo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.to}
              href={link.to}
              onClick={() => handleSectionClick(link.to)}
              className="text-sm text-[#A8A8C0] transition hover:text-[#F0F0F8]"
            >
              {t(link.labelKey)}
            </a>
          ))}
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm text-[#A8A8C0] transition hover:text-[#F0F0F8]">
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/login" className="hidden text-sm font-medium text-[#F0F0F8] transition hover:text-[#F5C000] sm:block">
            {t("marketing.nav.signIn")}
          </Link>
          <Button asChild className="hidden h-10 rounded-xl bg-[#F5C000] px-4 text-sm font-semibold text-[#0B0B15] hover:bg-[#E6C43A] sm:inline-flex">
            <Link to="/contact">{t("marketing.cta.requestAccess")}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button aria-label="Open menu" className="h-10 w-10 rounded-xl border-white/10 bg-white/5 p-0 lg:hidden" variant="outline">
                <Menu className="h-5 w-5 text-[#F0F0F8]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-[#0B0B15] p-0 text-[#F0F0F8]">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-2 px-6 py-8">
                <div className="mb-4">
                  <MarketingLogo />
                </div>
                {SECTION_LINKS.map((link) => (
                  <a key={link.to} href={link.to} className="rounded-lg px-3 py-2.5 text-base text-[#A8A8C0] hover:bg-white/5 hover:text-[#F0F0F8]">
                    {t(link.labelKey)}
                  </a>
                ))}
                {NAV_LINKS.map((link) => (
                  <Link key={link.to} to={link.to} className="rounded-lg px-3 py-2.5 text-base text-[#A8A8C0] hover:bg-white/5 hover:text-[#F0F0F8]">
                    {t(link.labelKey)}
                  </Link>
                ))}
                <Link to="/login" className="rounded-lg px-3 py-2.5 text-base font-medium text-[#F0F0F8] hover:bg-white/5">
                  {t("marketing.nav.signIn")}
                </Link>
                <Button asChild className="mt-3 h-11 rounded-xl bg-[#F5C000] text-base font-semibold text-[#0B0B15] hover:bg-[#E6C43A]">
                  <Link to="/contact">{t("marketing.cta.requestAccess")}</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
