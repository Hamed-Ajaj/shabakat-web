export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export type LegalLocale = "en" | "ar";

const PLACEHOLDERS = {
  legalEntity: "{{LEGAL_ENTITY}}",
  domain: "{{DOMAIN}}",
  supportEmail: "{{SUPPORT_EMAIL}}",
  businessAddress: "{{BUSINESS_ADDRESS}}",
  governingLaw: "{{GOVERNING_LAW}}",
};

export const privacyContent: Record<LegalLocale, LegalSection[]> = {
  en: [
    {
      id: "introduction",
      title: "Introduction",
      paragraphs: [
        `This Privacy Policy explains how ${PLACEHOLDERS.legalEntity} ("we", "us") collects, uses, and protects information in connection with the Shabakat software, including our website, web dashboard, mobile application, and desktop application (together, the "Service").`,
        "Shabakat is a business tool for electricity generator operators. The operator who subscribes to Shabakat is the data controller of their subscribers' information. We process that information on the operator's behalf. If you are a subscriber of a generator operator and have questions about your data, please contact your operator first.",
      ],
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      paragraphs: [
        "Account information. When your company is set up on Shabakat, we collect the operator's company name, company logo, and the name, email address, and encrypted password of the operator's users (Owner, Admin, and employee accounts).",
        "Subscriber information entered by the operator. The Service lets operators record information about their own subscribers, including name, phone number, address, area or zone, distribution box, connection details, subscription type, subscription value, meter readings, invoices, payments, and payment notes.",
        "Operational records. Invoices, payments, expenses, meter readings, audit logs, and related records you create in the Service.",
        "Technical information. Authentication tokens, device and application version, and server logs generated when you use the Service.",
        "Communications. If you contact us, we collect the information you provide in that message.",
        "We do not collect precise location data, and we do not use advertising trackers.",
      ],
    },
    {
      id: "how-we-use-information",
      title: "How we use information",
      paragraphs: [
        "We use the information to: provide and operate the Service; create and manage accounts and permissions; calculate bills and generate invoices; send payment reminders through WhatsApp when the operator enables them; provide offline and backup functionality; maintain security and prevent misuse; provide support; and comply with legal obligations.",
      ],
    },
    {
      id: "how-we-share-information",
      title: "How we share information",
      paragraphs: [
        "We do not sell personal information. We share information only with the service providers needed to run the Service, and only as required to provide it. These currently include:",
        "Cloud hosting and database providers that store the application and its data.",
        "Cloudflare R2 for storing company logos and optional desktop backups.",
        "A WhatsApp messaging provider used to send reminders and messages on the operator's instructions. Messages are sent through the WhatsApp platform, which is operated by Meta.",
        "We may also disclose information if required by law or to protect rights and safety.",
      ],
    },
    {
      id: "whatsapp-messaging",
      title: "WhatsApp messaging",
      paragraphs: [
        "If the operator connects a WhatsApp number and enables reminders, Shabakat sends messages to subscriber phone numbers through the WhatsApp platform. The operator is responsible for having a lawful basis to message their subscribers. Message content and delivery are also subject to WhatsApp's own terms and privacy policy.",
      ],
    },
    {
      id: "data-retention",
      title: "Data retention",
      paragraphs: [
        "We retain account and operational data for as long as the operator's account is active, and for a reasonable period afterward to comply with legal, tax, and accounting obligations. Operators may request deletion of their account data as described below.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We use technical and organizational measures to protect information, including password hashing, authentication tokens, encryption in transit, and per-company data isolation. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      id: "data-isolation",
      title: "Data isolation between companies",
      paragraphs: [
        "Each company's data is scoped and isolated so that a company and its authorized users can access only their own data.",
      ],
    },
    {
      id: "international-transfers",
      title: "International transfers",
      paragraphs: [
        "Our service providers may store or process data outside Lebanon. Where required, we take steps to ensure appropriate safeguards are in place.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      paragraphs: [
        `Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict processing of your personal information, and to object to certain processing. Operators can exercise these rights for their account data, and subscribers should contact their operator. To make a request to us directly, contact ${PLACEHOLDERS.supportEmail}.`,
      ],
    },
    {
      id: "account-and-data-deletion",
      title: "Account and data deletion",
      paragraphs: [
        "Account holders can request deletion of their account and associated data by:",
        `Using the Data Deletion Request page at https://${PLACEHOLDERS.domain}/data-deletion, or`,
        `Emailing ${PLACEHOLDERS.supportEmail} from the email address associated with the account.`,
        "We will verify the request and process it within a reasonable period, subject to legal retention requirements. Some records, such as paid invoices, may need to be retained for accounting purposes; where possible, they are retained in a de-identified form.",
      ],
    },
    {
      id: "childrens-privacy",
      title: "Children's privacy",
      paragraphs: [
        "The Service is a business tool and is not intended for children. We do not knowingly collect information from children.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: [
        "We may update this policy from time to time. We will update the effective date and, for material changes, provide notice through the Service or website.",
      ],
    },
    {
      id: "contact-us",
      title: "Contact us",
      paragraphs: [
        `Questions about this policy can be sent to ${PLACEHOLDERS.supportEmail} or ${PLACEHOLDERS.businessAddress}.`,
      ],
    },
  ],
  ar: [
    {
      id: "introduction",
      title: "مقدمة",
      paragraphs: [
        `تشرح سياسة الخصوصية هذه كيف تقوم ${PLACEHOLDERS.legalEntity} ("نحن") بجمع المعلومات واستخدامها وحمايتها فيما يتعلق ببرنامج Shabakat، بما في ذلك موقعنا الإلكتروني ولوحة التحكم على الويب وتطبيق الهاتف وتطبيق سطح المكتب (يُشار إليها مجتمعة بـ"الخدمة").`,
        "Shabakat أداة أعمال لمشغّلي مولدات الكهرباء. المشغّل المشترك في Shabakat هو المتحكم في بيانات مشتركيه. نحن نعالج تلك المعلومات نيابةً عن المشغّل. إذا كنت مشتركاً لدى مشغّل مولدات ولديك أسئلة حول بياناتك، يرجى التواصل مع مشغّلك أولاً.",
      ],
    },
    {
      id: "information-we-collect",
      title: "المعلومات التي نجمعها",
      paragraphs: [
        "معلومات الحساب. عند إعداد شركتك على Shabakat، نجمع اسم شركة المشغّل وشعارها، واسم مستخدمي المشغّل وبريدهم الإلكتروني وكلمة المرور المشفرة (حسابات المالك والمدير والموظفين).",
        "معلومات المشتركين التي يُدخلها المشغّل. تتيح الخدمة للمشغّلين تسجيل معلومات عن مشتركيهم، بما في ذلك الاسم ورقم الهاتف والعنوان والمنطقة وعلبة التوزيع وتفاصيل الربط ونوع الاشتراك وقيمته وقراءات العدّاد والفواتير والمدفوعات وملاحظات الدفع.",
        "السجلات التشغيلية. الفواتير والمدفوعات والمصروفات وقراءات العدّاد وسجلات التدقيق والسجلات ذات الصلة التي تنشئها في الخدمة.",
        "المعلومات التقنية. رموز المصادقة وإصدار الجهاز والتطبيق وسجلات الخادم الناتجة عند استخدامك للخدمة.",
        "المراسلات. إذا تواصلت معنا، نجمع المعلومات التي تقدمها في تلك الرسالة.",
        "لا نجمع بيانات الموقع الدقيقة، ولا نستخدم أدوات تتبع إعلانية.",
      ],
    },
    {
      id: "how-we-use-information",
      title: "كيف نستخدم المعلومات",
      paragraphs: [
        "نستخدم المعلومات من أجل: توفير الخدمة وتشغيلها؛ وإنشاء الحسابات والصلاحيات وإدارتها؛ وحساب الفواتير وإنشائها؛ وإرسال تذكيرات الدفع عبر واتساب عند تفعيل المشغّل لها؛ وتوفير وظيفة العمل دون اتصال والنسخ الاحتياطي؛ والحفاظ على الأمان ومنع إساءة الاستخدام؛ وتقديم الدعم؛ والامتثال للالتزامات القانونية.",
      ],
    },
    {
      id: "how-we-share-information",
      title: "كيف نشارك المعلومات",
      paragraphs: [
        "لا نبيع المعلومات الشخصية. نشارك المعلومات فقط مع مزوّدي الخدمة اللازمين لتشغيل الخدمة، وبالقدر المطلوب لتوفيرها فقط. يشمل ذلك حالياً:",
        "مزوّدو الاستضافة السحابية وقواعد البيانات الذين يخزّنون التطبيق وبياناته.",
        "Cloudflare R2 لتخزين شعارات الشركات والنسخ الاحتياطية الاختيارية لسطح المكتب.",
        "مزوّد مراسلة واتساب المستخدم لإرسال التذكيرات والرسائل بناءً على تعليمات المشغّل. تُرسل الرسائل عبر منصة واتساب التي تديرها Meta.",
        "قد نفصح عن المعلومات أيضاً إذا طلب القانون ذلك أو لحماية الحقوق والسلامة.",
      ],
    },
    {
      id: "whatsapp-messaging",
      title: "رسائل واتساب",
      paragraphs: [
        "إذا ربط المشغّل رقماً على واتساب وفعّل التذكيرات، يرسل Shabakat رسائل إلى أرقام هواتف المشتركين عبر منصة واتساب. يتحمل المشغّل مسؤولية وجود أساس قانوني لمراسلة مشتركيه. يخضع محتوى الرسائل وتسليمها أيضاً لشروط وسياسة خصوصية واتساب.",
      ],
    },
    {
      id: "data-retention",
      title: "الاحتفاظ بالبيانات",
      paragraphs: [
        "نحتفظ ببيانات الحساب والبيانات التشغيلية طالما كان حساب المشغّل نشطاً، ولفترة معقولة بعد ذلك للامتثال للالتزامات القانونية والضريبية والمحاسبية. يمكن للمشغّلين طلب حذف بيانات حساباتهم كما هو موضح أدناه.",
      ],
    },
    {
      id: "security",
      title: "الأمان",
      paragraphs: [
        "نستخدم تدابير تقنية وتنظيمية لحماية المعلومات، بما في ذلك تشفير كلمات المرور ورموز المصادقة والتشفير أثناء النقل وعزل البيانات بين الشركات. لا توجد وسيلة نقل أو تخزين آمنة تماماً، ولا يمكننا ضمان الأمان المطلق.",
      ],
    },
    {
      id: "data-isolation",
      title: "عزل البيانات بين الشركات",
      paragraphs: [
        "تُعزل بيانات كل شركة وتُفصل بحيث لا يتمكن أي شركة ومستخدميها المصرّح لهم إلا من الوصول إلى بياناتهم الخاصة.",
      ],
    },
    {
      id: "international-transfers",
      title: "نقل البيانات دولياً",
      paragraphs: [
        "قد يخزّن مزوّدو الخدمة لدينا البيانات أو يعالجونها خارج لبنان. وعند الحاجة، نتخذ خطوات لضمان وجود ضمانات مناسبة.",
      ],
    },
    {
      id: "your-rights",
      title: "حقوقك",
      paragraphs: [
        `بحسب نطاق اختصاصك، قد يكون لديك الحق في الوصول إلى معلوماتك الشخصية أو تصحيحها أو حذفها أو تقييد معالجتها، والاعتراض على معالجة معيّنة. يمكن للمشغّلين ممارسة هذه الحقوق لبيانات حساباتهم، وعلى المشتركين التواصل مع مشغّلهم. لتقديم طلب إلينا مباشرة، تواصل مع ${PLACEHOLDERS.supportEmail}.`,
      ],
    },
    {
      id: "account-and-data-deletion",
      title: "حذف الحساب والبيانات",
      paragraphs: [
        "يمكن لأصحاب الحسابات طلب حذف حساباتهم والبيانات المرتبطة بها من خلال:",
        `استخدام صفحة طلب حذف البيانات على https://${PLACEHOLDERS.domain}/data-deletion، أو`,
        `مراسلة ${PLACEHOLDERS.supportEmail} من البريد الإلكتروني المرتبط بالحساب.`,
        "سنتحقق من الطلب ونعالجه خلال فترة معقولة، مع مراعاة متطلبات الاحتفاظ القانونية. قد يلزم الاحتفاظ ببعض السجلات، مثل الفواتير المدفوعة، لأغراض محاسبية؛ وعند الإمكان تُحفظ في صورة منزوعة التعريف.",
      ],
    },
    {
      id: "childrens-privacy",
      title: "خصوصية الأطفال",
      paragraphs: [
        "الخدمة أداة أعمال وليست موجّهة للأطفال. نحن لا نجمع معلومات من الأطفال عن علم.",
      ],
    },
    {
      id: "changes",
      title: "التغييرات على هذه السياسة",
      paragraphs: [
        "قد نحدّث هذه السياسة من وقت لآخر. سنحدّث تاريخ السريان، وبالنسبة للتغييرات الجوهرية سنقدّم إشعاراً عبر الخدمة أو الموقع.",
      ],
    },
    {
      id: "contact-us",
      title: "اتصل بنا",
      paragraphs: [
        `يمكن إرسال الأسئلة حول هذه السياسة إلى ${PLACEHOLDERS.supportEmail} أو ${PLACEHOLDERS.businessAddress}.`,
      ],
    },
  ],
};

export const termsContent: Record<LegalLocale, LegalSection[]> = {
  en: [
    { id: "acceptance", title: "Acceptance of terms", paragraphs: ["By using the Service you agree to these terms."] },
    { id: "the-service", title: "The Service", paragraphs: ["Shabakat is business software for electricity generator operators."] },
    { id: "accounts", title: "Accounts", paragraphs: [`Accounts are created and managed by ${PLACEHOLDERS.legalEntity}. The operator is responsible for its users and credentials.`] },
    { id: "operator-responsibilities", title: "Operator responsibilities", paragraphs: ["The operator must have the right to process its subscribers' data and to message them."] },
    { id: "acceptable-use", title: "Acceptable use", paragraphs: ["No unlawful use, no attempts to breach security, no reselling without permission."] },
    { id: "subscriptions-and-payment", title: "Subscriptions and payment", paragraphs: ["How the operator pays for Shabakat is arranged directly with our team."] },
    { id: "intellectual-property", title: "Intellectual property", paragraphs: [`The software and brand belong to ${PLACEHOLDERS.legalEntity}. Operator data belongs to the operator.`] },
    { id: "third-party-services", title: "Third-party services", paragraphs: ["WhatsApp and cloud providers are subject to their own terms."] },
    { id: "availability-and-support", title: "Availability and support", paragraphs: ["Best-effort availability; offline desktop works without our servers."] },
    { id: "disclaimer", title: "Disclaimer of warranties", paragraphs: ['Provided "as is" to the extent permitted by law.'] },
    { id: "limitation", title: "Limitation of liability", paragraphs: ["To the extent permitted by law, our liability is limited."] },
    { id: "termination", title: "Termination", paragraphs: ["Either party may end the agreement; data deletion follows the privacy policy."] },
    { id: "governing-law", title: "Governing law", paragraphs: [`These terms are governed by ${PLACEHOLDERS.governingLaw}.`] },
    { id: "changes", title: "Changes to terms", paragraphs: ["We may update these terms and will update the effective date."] },
    { id: "contact", title: "Contact", paragraphs: [`Questions can be sent to ${PLACEHOLDERS.supportEmail}.`] },
  ],
  ar: [
    { id: "acceptance", title: "قبول الشروط", paragraphs: ["باستخدامك الخدمة فإنك توافق على هذه الشروط."] },
    { id: "the-service", title: "الخدمة", paragraphs: ["Shabakat برنامج أعمال لمشغّلي مولدات الكهرباء."] },
    { id: "accounts", title: "الحسابات", paragraphs: [`تُنشأ الحسابات وتُدار من قبل ${PLACEHOLDERS.legalEntity}. يتحمل المشغّل مسؤولية مستخدميه وبيانات الدخول الخاصة بهم.`] },
    { id: "operator-responsibilities", title: "مسؤوليات المشغّل", paragraphs: ["يجب أن يكون للمشغّل الحق في معالجة بيانات مشتركيه ومراسلتهم."] },
    { id: "acceptable-use", title: "الاستخدام المقبول", paragraphs: ["لا استخدام غير قانوني، ولا محاولات لخرق الأمان، ولا إعادة بيع دون إذن."] },
    { id: "subscriptions-and-payment", title: "الاشتراكات والدفع", paragraphs: ["تُرتَّب طريقة دفع المشغّل مقابل Shabakat مباشرة مع فريقنا."] },
    { id: "intellectual-property", title: "الملكية الفكرية", paragraphs: [`يعود البرنامج والعلامة التجارية إلى ${PLACEHOLDERS.legalEntity}. بيانات المشغّل ملك للمشغّل.`] },
    { id: "third-party-services", title: "خدمات الطرف الثالث", paragraphs: ["تخضع واتساب ومزوّدو الخدمات السحابية لشروطهم الخاصة."] },
    { id: "availability-and-support", title: "التوفر والدعم", paragraphs: ["توفر بأفضل جهد؛ يعمل تطبيق سطح المكتب دون اتصال بدون خوادمنا."] },
    { id: "disclaimer", title: "إخلاء الضمانات", paragraphs: ["تُقدَّم الخدمة \"كما هي\" بالقدر الذي يسمح به القانون."] },
    { id: "limitation", title: "تحديد المسؤولية", paragraphs: ["بالقدر الذي يسمح به القانون، تكون مسؤوليتنا محدودة."] },
    { id: "termination", title: "الإنهاء", paragraphs: ["يجوز لأي طرف إنهاء الاتفاقية؛ ويتم حذف البيانات وفق سياسة الخصوصية."] },
    { id: "governing-law", title: "القانون الحاكم", paragraphs: [`تخضع هذه الشروط لـ ${PLACEHOLDERS.governingLaw}.`] },
    { id: "changes", title: "التغييرات على الشروط", paragraphs: ["قد نحدّث هذه الشروط وسنحدّث تاريخ السريان."] },
    { id: "contact", title: "اتصل بنا", paragraphs: [`يمكن إرسال الأسئلة إلى ${PLACEHOLDERS.supportEmail}.`] },
  ],
};
