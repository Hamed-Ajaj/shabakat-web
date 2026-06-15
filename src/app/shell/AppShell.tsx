import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { BottomNavigation } from "./components/BottomNavigation";
import { DesktopSidebar } from "./components/DesktopSidebar";
import { TopNavigation } from "./components/TopNavigation";

export function AppShell({ children }: Readonly<{ children?: React.ReactNode }>) {
  return (
    <SidebarProvider className="min-h-dvh bg-background">
      <DesktopSidebar />
      <SidebarInset className="min-h-dvh">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4 md:px-6 md:pb-6 md:pt-6">
          {children ?? <Outlet />}
        </main>
      </SidebarInset>
      <BottomNavigation />
    </SidebarProvider>
  );
}
