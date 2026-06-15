import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { useAuth } from "../../providers/AuthProvider";
import { navigationItems } from "../../shared/data/mockData";
import { AppLogo } from "../../shared/components/AppLogo";
import { Avatar } from "../../shared/components/Avatar";

export function DesktopSidebar() {
  const { logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <AppLogo />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
            {navigationItems.map(({ to, icon: Icon, label, badge }) => (
              <SidebarMenuItem key={to}>
                <NavLink to={to}>
                  {({ isActive }) => (
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-11 rounded-xl px-3 text-sm text-muted-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-white/5 hover:text-foreground"
                    >
                      <span>
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{label}</span>
                        {badge ? (
                          <SidebarMenuBadge className={isActive ? "rounded-full bg-black/15 px-1 text-primary-foreground" : "rounded-full bg-red-500 px-1 text-white"}>
                            {badge}
                          </SidebarMenuBadge>
                        ) : null}
                      </span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/8 px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar name="Karim El-Nour" size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">Karim El-Nour</p>
            <p className="text-xs text-muted-foreground">Owner · Hamra</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
