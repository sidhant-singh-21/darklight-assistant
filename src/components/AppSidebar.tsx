
import { Mic, Camera, User, Settings, MessageSquare, RotateCcw } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Profile", icon: User, url: "#" },
  { title: "Saved Chats", icon: MessageSquare, url: "#" },
  { title: "Reset Chat", icon: RotateCcw, url: "#" },
];

const inputItems = [
  { title: "Voice Input", icon: Mic, url: "#" },
  { title: "Camera Input", icon: Camera, url: "#" },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-[240px] glass">
      <div className="p-4 flex justify-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          AI Assistant
        </h1>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-secondary transition-colors">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Input Methods</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {inputItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-secondary transition-colors">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
