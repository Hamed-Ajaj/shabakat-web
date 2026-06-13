import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./components/BottomNavigation";
import { DesktopSidebar } from "./components/DesktopSidebar";
import { MobileSidebar } from "./components/MobileSidebar";
import { TopNavigation } from "./components/TopNavigation";

export function AppShell({ children }: Readonly<{ children?: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-background">
      <div className="hidden md:flex">
        <DesktopSidebar />
      </div>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavigation onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4 md:px-6 md:pb-6 md:pt-6">
          {children ?? <Outlet />}
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
