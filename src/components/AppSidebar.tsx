
import { Mic, Camera, User, MessageSquare, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Profile feature coming soon!",
    });
  };

  const handleSavedChatsClick = () => {
    toast({
      title: "Saved Chats",
      description: "Saved chats feature coming soon!",
    });
  };

  const handleResetChat = () => {
    // In a real app, this would clear the chat state
    toast({
      title: "Chat Reset",
      description: "Chat has been reset.",
    });
    navigate(0); // Refresh the page for now
  };

  const handleVoiceInput = () => {
    toast({
      title: "Voice Input",
      description: "Voice input feature coming soon!",
    });
  };

  const handleCameraInput = () => {
    toast({
      title: "Camera Input",
      description: "Camera input feature coming soon!",
    });
  };

  const menuItems = [
    { title: "Profile", icon: User, onClick: handleProfileClick },
    { title: "Saved Chats", icon: MessageSquare, onClick: handleSavedChatsClick },
    { title: "Reset Chat", icon: RotateCcw, onClick: handleResetChat },
  ];

  const inputItems = [
    { title: "Voice Input", icon: Mic, onClick: handleVoiceInput },
    { title: "Camera Input", icon: Camera, onClick: handleCameraInput },
  ];

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
                    <button
                      onClick={item.onClick}
                      className="w-full flex items-center gap-2 px-2 py-1 rounded-md hover:bg-secondary transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
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
                    <button
                      onClick={item.onClick}
                      className="w-full flex items-center gap-2 px-2 py-1 rounded-md hover:bg-secondary transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
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
