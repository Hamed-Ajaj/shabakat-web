import { FileText, Gauge, MapPinned, MessageCircle, ReceiptText, TrendingUp, Users, Wallet, WifiOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ContentItem {
  icon?: LucideIcon;
  title: string;
  description: string;
}

export interface LandingContent {
  hero: { eyebrow: string; title: string; subtitle: string; bullets: string[] };
  stats: string[];
  problem: { heading: string; body: string };
  features: ContentItem[];
  plans: ContentItem[];
  how: ContentItem[];
  platform: ContentItem[];
  offline: { heading: string; body: string; bullets: string[] };
  security: { heading: string; body: string };
  pricing: { heading: string; body: string };
  faq: ContentItem[];
  finalCta: { heading: string };
}

const featureIcons: LucideIcon[] = [Users, FileText, Gauge, ReceiptText, Wallet, MessageCircle, TrendingUp, MapPinned, WifiOff];

export const landingContent: Record<"en" | "ar", LandingContent> = {
  en: {
    hero: {
      eyebrow: "Generator operations, simplified",
      title: "Billing and subscriber management for private generators.",
      subtitle: "Shabakat keeps your subscribers, meter readings, invoices, and payment reminders in one place. Works in English and Arabic, online or offline.",
      bullets: ["No setup fees to start", "English and Arabic", "Works offline"],
    },
    stats: ["3 billing plans: Ampere, Kilowatt, Fixed Kilowatt", "EN / AR with full RTL", "Offline on desktop", "WhatsApp reminders"],
    problem: {
      heading: "Running a generator by hand does not scale.",
      body: "Paper notebooks, missed payments, and guessing who owes what cost you time and money. Shabakat turns that manual work into a clean, searchable system.",
    },
    features: [
      { title: "Subscriber management", description: "Keep every subscriber, address, area, and connection detail in one searchable list." },
      { title: "Flexible billing plans", description: "Bill by ampere, by metered kilowatt, or prepaid kilowatt credits." },
      { title: "Meter readings", description: "Record monthly readings and let Shabakat calculate consumption automatically." },
      { title: "Invoices in one click", description: "Generate one invoice or a full month for all active subscribers at once." },
      { title: "Payments and balances", description: "Record full or partial payments and see who still owes you." },
      { title: "Automatic WhatsApp reminders", description: "Send payment reminders to unpaid subscribers on the day you choose." },
      { title: "Expenses and profit", description: "Track fuel, maintenance, and salaries to see your real net income." },
      { title: "Areas and distribution boxes", description: "Organize subscribers by zone, box, and cable." },
      { title: "Offline capability", description: "Keep working on desktop with no internet; view saved data on mobile offline." },
    ],
    plans: [
      { title: "Ampere", description: "A fixed monthly amount based on the subscriber's ampere rating." },
      { title: "Kilowatt", description: "Billed on actual consumption: this month's reading minus last month's." },
      { title: "Fixed Kilowatt", description: "The subscriber pays at the counter and the amount is converted to kWh credit instantly." },
    ],
    how: [
      { title: "Add your subscribers", description: "Name, phone, area, and plan." },
      { title: "Record readings and generate invoices", description: "Single or bulk." },
      { title: "Record payments and send reminders", description: "Cash, Wish, or your own method." },
      { title: "Watch your numbers", description: "Dashboard shows collected, outstanding, and net income." },
    ],
    platform: [
      { title: "Web dashboard", description: "Manage everything from your browser. Areas, subscribers, invoices, expenses, and settings." },
      { title: "Mobile app", description: "Bill and check on the go. Includes offline access to your saved data and an AI assistant." },
      { title: "Desktop app (Windows)", description: "Run everything fully offline on your PC, with automatic cloud backup and a fuel market view." },
    ],
    offline: {
      heading: "Your data does not stop when the internet does.",
      body: "Shabakat is built for unreliable connections and long outages.",
      bullets: ["Mobile shows your saved subscribers and invoices offline", "Desktop runs fully standalone on a local database", "Optional automatic backup to the cloud"],
    },
    security: {
      heading: "Your subscribers' data is isolated per company.",
      body: "Only you and the employees you authorize can see it.",
    },
    pricing: {
      heading: "Get set up with Shabakat.",
      body: "Shabakat is provided to generator operators directly. Tell us about your network and we will set up your account.",
    },
    faq: [
      { title: "Do I need a credit card to use Shabakat?", description: "No. Payment is arranged directly with our team." },
      { title: "Does Shabakat work without internet?", description: "The desktop app runs fully offline. The mobile app shows your saved data offline and syncs when you reconnect." },
      { title: "Which languages are supported?", description: "English and Arabic, including full right-to-left layout." },
      { title: "Can my employees use it?", description: "Yes. You can create employee accounts with limited permissions." },
      { title: "How are reminders sent?", description: "Through WhatsApp, from a number you connect by scanning a QR code." },
      { title: "Does Shabakat process online payments for my subscribers?", description: "No. You record payments as you receive them; Shabakat tracks the balances." },
      { title: "Is there an app store link?", description: "The mobile app is distributed by invitation. Request access and we will send you the link." },
    ],
    finalCta: { heading: "Ready to modernize your generator billing?" },
  },
  ar: {
    hero: {
      eyebrow: "إدارة المولدات ببساطة",
      title: "الفوترة وإدارة المشتركين للمولدات الخاصة.",
      subtitle: "يجمع Shabakat مشتركيك وقراءات العدّادات والفواتير وتذكيرات الدفع في مكان واحد. يعمل بالعربية والإنجليزية، عبر الإنترنت أو بدونه.",
      bullets: ["لا رسوم إعداد للبدء", "العربية والإنجليزية", "يعمل دون اتصال"],
    },
    stats: ["3 خطط فوترة: أمبير، كيلوواط، كيلوواط ثابت", "عربي / إنجليزي مع دعم RTL كامل", "دون اتصال على سطح المكتب", "تذكيرات واتساب"],
    problem: {
      heading: "إدارة المولد يدوياً لا تتوسّع.",
      body: "الدفاتر الورقية والمدفوعات المفوّتة والتخمين فيمن يدين لك يكلّفك وقتاً ومالاً. يحوّل Shabakat ذلك العمل اليدوي إلى نظام نظيف قابل للبحث.",
    },
    features: [
      { title: "إدارة المشتركين", description: "احتفظ بكل مشترك وعنوانه ومنطقته وتفاصيل ربطه في قائمة واحدة قابلة للبحث." },
      { title: "خطط فوترة مرنة", description: "فوترة بالأمبير أو بالكيلوواط المُقاس أو بأرصدة الكيلوواط المسبقة الدفع." },
      { title: "قراءات العدّادات", description: "سجّل القراءات الشهرية ودع Shabakat يحسب الاستهلاك تلقائياً." },
      { title: "فواتير بنقرة واحدة", description: "أنشئ فاتورة واحدة أو شهراً كاملاً لجميع المشتركين النشطين دفعة واحدة." },
      { title: "المدفوعات والأرصدة", description: "سجّل مدفوعات كاملة أو جزئية واعرف من يدين لك." },
      { title: "تذكيرات واتساب تلقائية", description: "أرسل تذكيرات الدفع للمشتركين غير المسدّدين في اليوم الذي تختاره." },
      { title: "المصروفات والأرباح", description: "تتبّع الوقود والصيانة والرواتب لترى صافي دخلك الحقيقي." },
      { title: "المناطق وعلب التوزيع", description: "نظّم المشتركين حسب المنطقة والعلبة والكابل." },
      { title: "القدرة على العمل دون اتصال", description: "واصل العمل على سطح المكتب دون إنترنت؛ واعرض البيانات المحفوظة على الهاتف دون اتصال." },
    ],
    plans: [
      { title: "أمبير", description: "مبلغ شهري ثابت بناءً على تصنيف أمبير المشترك." },
      { title: "كيلوواط", description: "الفوترة حسب الاستهلاك الفعلي: قراءة هذا الشهر ناقص قراءة الشهر الماضي." },
      { title: "كيلوواط ثابت", description: "يدفع المشترك عند العدّاد ويُحوَّل المبلغ إلى رصيد كيلوواط فوراً." },
    ],
    how: [
      { title: "أضف مشتركيك", description: "الاسم والهاتف والمنطقة والخطة." },
      { title: "سجّل القراءات وأنشئ الفواتير", description: "فردية أو بالجملة." },
      { title: "سجّل المدفوعات وأرسل التذكيرات", description: "نقداً أو Wish أو بطريقتك الخاصة." },
      { title: "راقب أرقامك", description: "تعرض لوحة التحكم المحصّل والمستحق وصافي الدخل." },
    ],
    platform: [
      { title: "لوحة تحكم الويب", description: "أدر كل شيء من متصفحك. المناطق والمشتركون والفواتير والمصروفات والإعدادات." },
      { title: "تطبيق الهاتف", description: "فوترة ومتابعة أثناء التنقل. يشمل وصولاً دون اتصال لبياناتك المحفوظة ومساعداً بالذكاء الاصطناعي." },
      { title: "تطبيق سطح المكتب (ويندوز)", description: "شغّل كل شيء دون اتصال تماماً على حاسوبك، مع نسخ احتياطي سحابي تلقائي وعرض أسعار الوقود." },
    ],
    offline: {
      heading: "بياناتك لا تتوقف عندما يتوقف الإنترنت.",
      body: "صُمم Shabakat للاتصالات غير الموثوقة والانقطاعات الطويلة.",
      bullets: ["يعرض الهاتف مشتركيك وفواتيرك المحفوظة دون اتصال", "يعمل سطح المكتب بشكل مستقل تماماً على قاعدة بيانات محلية", "نسخ احتياطي سحابي تلقائي اختياري"],
    },
    security: {
      heading: "بيانات مشتركيك معزولة لكل شركة.",
      body: "لا يراها إلا أنت والموظفون الذين تأذن لهم.",
    },
    pricing: {
      heading: "ابدأ مع Shabakat.",
      body: "يُقدَّم Shabakat لمشغّلي المولدات مباشرة. أخبرنا عن شبكتك وسنُعدّ حسابك.",
    },
    faq: [
      { title: "هل أحتاج إلى بطاقة ائتمان لاستخدام Shabakat؟", description: "لا. تُرتَّب عملية الدفع مباشرة مع فريقنا." },
      { title: "هل يعمل Shabakat دون إنترنت؟", description: "يعمل تطبيق سطح المكتب دون اتصال تماماً. ويعرض تطبيق الهاتف بياناتك المحفوظة دون اتصال ويتزامن عند إعادة الاتصال." },
      { title: "ما اللغات المدعومة؟", description: "العربية والإنجليزية، بما في ذلك التخطيط الكامل من اليمين إلى اليسار." },
      { title: "هل يمكن لموظفّي استخدامه؟", description: "نعم. يمكنك إنشاء حسابات موظفين بصلاحيات محدودة." },
      { title: "كيف تُرسل التذكيرات؟", description: "عبر واتساب، من رقم تربطه بمسح رمز QR." },
      { title: "هل يعالج Shabakat المدفوعات الإلكترونية لمشتركيّ؟", description: "لا. تسجّل المدفوعات عند استلامها؛ ويتتبّع Shabakat الأرصدة." },
      { title: "هل يوجد رابط متجر تطبيقات؟", description: "يُوزَّع تطبيق الهاتف بالدعوة. اطلب الوصول وسنرسل لك الرابط." },
    ],
    finalCta: { heading: "جاهز لتحديث فوترة مولدك؟" },
  },
};

export { featureIcons };
