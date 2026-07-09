import { Boxes, Clock3, FileText, LayoutDashboard, MapPinned, Settings, Users, Wallet } from "lucide-react";
import type { TranslationKey } from "../i18n/messages";
import type { NavigationItem, RevenuePoint, Subscriber } from "../types/domain";

export const subscribers: Subscriber[] = [
  { id: 1, name: "Ahmad Khalil", phone: "+961 71 234 567", area: "Hamra", ampere: "5A", subscriptionDate: "Jan 15, 2024", status: "paid", amount: 85, dueDate: "Jun 15, 2025" },
  { id: 2, name: "Rania Mansour", phone: "+961 70 345 678", area: "Achrafieh", ampere: "10A", subscriptionDate: "Feb 1, 2024", status: "unpaid", amount: 150, dueDate: "May 28, 2025" },
  { id: 3, name: "Khalid Barakat", phone: "+961 76 456 789", area: "Verdun", ampere: "5A", subscriptionDate: "Nov 20, 2023", status: "paid", amount: 85, dueDate: "Jun 20, 2025" },
  { id: 4, name: "Lara Haddad", phone: "+961 78 567 890", area: "Gemmayzeh", ampere: "15A", subscriptionDate: "Mar 10, 2024", status: "overdue", amount: 210, dueDate: "May 10, 2025" },
  { id: 5, name: "Hassan Nassar", phone: "+961 71 678 901", area: "Mar Elias", ampere: "5A", subscriptionDate: "Jan 5, 2024", status: "paid", amount: 85, dueDate: "Jun 5, 2025" },
  { id: 6, name: "Nadia Rizk", phone: "+961 70 789 012", area: "Badaro", ampere: "10A", subscriptionDate: "Dec 15, 2023", status: "unpaid", amount: 150, dueDate: "May 25, 2025" },
  { id: 7, name: "Fadi Gemayel", phone: "+961 76 890 123", area: "Sodeco", ampere: "20A", subscriptionDate: "Apr 1, 2024", status: "paid", amount: 280, dueDate: "Jun 1, 2025" },
  { id: 8, name: "Carla Khoury", phone: "+961 78 901 234", area: "Ras Beirut", ampere: "5A", subscriptionDate: "Feb 20, 2024", status: "paid", amount: 85, dueDate: "Jun 20, 2025" },
  { id: 9, name: "Rami Assaf", phone: "+961 71 012 345", area: "Raouche", ampere: "10A", subscriptionDate: "Oct 1, 2023", status: "overdue", amount: 150, dueDate: "May 1, 2025" },
  { id: 10, name: "Maya Frem", phone: "+961 70 123 456", area: "Tallet el Khayat", ampere: "15A", subscriptionDate: "Mar 25, 2024", status: "paid", amount: 210, dueDate: "Jun 25, 2025" },
  { id: 11, name: "Elie Saab", phone: "+961 76 234 567", area: "Monot", ampere: "5A", subscriptionDate: "Jan 30, 2024", status: "unpaid", amount: 85, dueDate: "May 30, 2025" },
  { id: 12, name: "Joelle Abou Jaoude", phone: "+961 78 345 678", area: "Hamra", ampere: "20A", subscriptionDate: "Sep 15, 2023", status: "paid", amount: 280, dueDate: "Jun 15, 2025" },
  { id: 13, name: "Georges Nassar", phone: "+961 71 456 789", area: "Achrafieh", ampere: "10A", subscriptionDate: "Apr 10, 2024", status: "paid", amount: 150, dueDate: "Jun 10, 2025" },
  { id: 14, name: "Sandra Zgheib", phone: "+961 70 567 890", area: "Verdun", ampere: "5A", subscriptionDate: "Feb 14, 2024", status: "overdue", amount: 85, dueDate: "May 14, 2025" },
  { id: 15, name: "Marwan Tabbara", phone: "+961 76 678 901", area: "Gemmayzeh", ampere: "30A", subscriptionDate: "Aug 1, 2023", status: "paid", amount: 390, dueDate: "Jun 1, 2025" },
];

export const revenueData: RevenuePoint[] = [
  { month: "Dec", billed: 9800, collected: 8200 },
  { month: "Jan", billed: 10500, collected: 9100 },
  { month: "Feb", billed: 11200, collected: 9800 },
  { month: "Mar", billed: 12100, collected: 10500 },
  { month: "Apr", billed: 11800, collected: 10200 },
  { month: "May", billed: 12450, collected: 11100 },
];

export const navigationItems: NavigationItem[] = [
  { to: "/dashboard", labelKey: "shell.nav.dashboard", icon: LayoutDashboard },
  { to: "/areas", labelKey: "shell.nav.areas", icon: MapPinned },
  { to: "/ampere-schedules", labelKey: "shell.nav.ampereSchedules", icon: Clock3 },
  { to: "/boxes", labelKey: "shell.nav.boxes", icon: Boxes },
  { to: "/subscribers", labelKey: "shell.nav.subscribers", icon: Users },
  { to: "/invoices", labelKey: "shell.nav.invoices", icon: FileText },
  { to: "/expenses", labelKey: "shell.nav.expenses", icon: Wallet },
  { to: "/settings", labelKey: "shell.nav.settings", icon: Settings },
];

export const mobileNavigationItems: NavigationItem[] = [
  { to: "/dashboard", labelKey: "shell.nav.dashboard", icon: LayoutDashboard },
  { to: "/subscribers", labelKey: "shell.nav.subscribers", icon: Users },
  { to: "/invoices", labelKey: "shell.nav.invoices", icon: FileText },
  { to: "/settings", labelKey: "shell.nav.settings", icon: Settings },
];

export const routeTitles: Record<string, { titleKey: TranslationKey; subtitleKey: TranslationKey }> = {
  "/dashboard": { titleKey: "shell.route.dashboard.title", subtitleKey: "shell.route.dashboard.subtitle" },
  "/areas": { titleKey: "shell.route.areas.title", subtitleKey: "shell.route.areas.subtitle" },
  "/ampere-schedules": { titleKey: "shell.route.ampereSchedules.title", subtitleKey: "shell.route.ampereSchedules.subtitle" },
  "/boxes": { titleKey: "shell.route.boxes.title", subtitleKey: "shell.route.boxes.subtitle" },
  "/subscribers": { titleKey: "shell.route.subscribers.title", subtitleKey: "shell.route.subscribers.subtitle" },
  "/invoices": { titleKey: "shell.route.invoices.title", subtitleKey: "shell.route.invoices.subtitle" },
  "/expenses": { titleKey: "shell.route.expenses.title", subtitleKey: "shell.route.expenses.subtitle" },
  "/settings": { titleKey: "shell.route.settings.title", subtitleKey: "shell.route.settings.subtitle" },
  "/settings/pricing/price-per-kilowatt": { titleKey: "shell.route.settingsPricePerKilowatt.title", subtitleKey: "shell.route.settingsPricePerKilowatt.subtitle" },
  "/settings/pricing/price-per-amp": { titleKey: "shell.route.settingsPricePerAmp.title", subtitleKey: "shell.route.settingsPricePerAmp.subtitle" },
  "/settings/pricing/fixed-charge": { titleKey: "shell.route.settingsFixedCharge.title", subtitleKey: "shell.route.settingsFixedCharge.subtitle" },
  "/settings/pricing/tva": { titleKey: "shell.route.settingsTva.title", subtitleKey: "shell.route.settingsTva.subtitle" },
  "/settings/due-date": { titleKey: "shell.route.settingsDueDate.title", subtitleKey: "shell.route.settingsDueDate.subtitle" },
  "/settings/trigger-date": { titleKey: "shell.route.settingsTriggerDate.title", subtitleKey: "shell.route.settingsTriggerDate.subtitle" },
  "/settings/trigger-message": { titleKey: "shell.route.settingsTriggerMessage.title", subtitleKey: "shell.route.settingsTriggerMessage.subtitle" },
  "/settings/language": { titleKey: "shell.route.settingsLanguage.title", subtitleKey: "shell.route.settingsLanguage.subtitle" },
  "/settings/ampere-schedule-pricing": { titleKey: "shell.route.settingsAmpereSchedulePricing.title", subtitleKey: "shell.route.settingsAmpereSchedulePricing.subtitle" },
  "/settings/whatsapp": { titleKey: "shell.route.settingsWhatsapp.title", subtitleKey: "shell.route.settingsWhatsapp.subtitle" },
};
