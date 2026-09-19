import type { LegalSection } from "../lib/legalContent";

export function LegalLayout({
  title,
  effectiveDate,
  intro,
  sections,
}: Readonly<{
  title: string;
  effectiveDate: string;
  intro?: string;
  sections: LegalSection[];
}>) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <header className="border-b border-white/10 pb-8">
        <h1 className="text-3xl font-bold text-[#F0F0F8]">{title}</h1>
        <p className="mt-3 text-sm text-[#7A7A9A]">{effectiveDate}</p>
        {intro ? <p className="mt-4 text-sm text-[#A8A8C0]">{intro}</p> : null}
      </header>

      <nav className="my-8 rounded-xl border border-white/10 bg-[#13131F] p-5">
        <p className="text-sm font-semibold text-[#F0F0F8]">Table of contents</p>
        <ol className="mt-3 list-inside list-decimal space-y-1.5">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-sm text-[#A8A8C0] hover:text-[#F5C000]">
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold text-[#F0F0F8]">{section.title}</h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-sm leading-relaxed text-[#A8A8C0]">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
