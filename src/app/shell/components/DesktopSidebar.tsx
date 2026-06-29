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
import { useI18n } from "../../providers/I18nProvider";
import { navigationItems } from "../../shared/data/mockData";
import { AppLogo } from "../../shared/components/AppLogo";
import { Avatar } from "../../shared/components/Avatar";

export function DesktopSidebar() {
  const { logout, session } = useAuth();
  const { isRtl, t } = useI18n();
  const displayName = session?.fullName ?? t("common.workspaceUser");
  const displayRole = translateRoleLabel(session?.role, t);
  const displayCompany = session?.companyName ?? t("shell.appName");

  return (
    <Sidebar side={isRtl ? "right" : "left"} dir={isRtl ? "rtl" : "ltr"}>
      <SidebarHeader className="px-4 py-5">
        <AppLogo />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {t("shell.mainMenu")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
            {navigationItems.map(({ to, icon: Icon, labelKey, badge }) => (
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
                        <span>{t(labelKey)}</span>
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
          <Avatar name={displayName} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{displayRole} · {displayCompany}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          {t("common.actions.logout")}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

function translateRoleLabel(role: string | undefined, t: ReturnType<typeof useI18n>["t"]) {
  if (role === "Owner") return t("common.roles.owner");
  if (role === "Admin") return t("common.roles.admin");
  if (role === "Member") return t("common.roles.member");
  return role ?? t("common.roles.member");
}
