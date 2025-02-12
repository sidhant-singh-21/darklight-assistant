
import { Mic, Camera, User, MessageSquare, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
      description: "Profile feature coming soon! This will allow you to customize your AI assistant experience.",
    });
  };

  const handleSavedChatsClick = () => {
    const savedChats = localStorage.getItem('chat-messages');
    if (savedChats) {
      toast({
        title: "Saved Chats",
        description: "Your chat history is automatically saved in your browser.",
      });
    } else {
      toast({
        title: "No Saved Chats",
        description: "Start a conversation to automatically save your chat history.",
      });
    }
  };

  const handleResetChat = () => {
    localStorage.removeItem('chat-messages');
    toast({
      title: "Chat Reset",
      description: "Chat history has been cleared.",
    });
    navigate(0);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      toast({
        title: "Voice Input",
        description: "Speech recognition is available but not yet implemented. Coming soon!",
      });
    } else {
      toast({
        title: "Voice Input Unavailable",
        description: "Your browser doesn't support voice input. Please try using Chrome.",
        variant: "destructive",
      });
    }
  };

  const handleCameraInput = () => {
    if ('mediaDevices' in navigator) {
      toast({
        title: "Camera Access",
        description: "Camera support is available but not yet implemented. Coming soon!",
      });
    } else {
      toast({
        title: "Camera Unavailable",
        description: "Your browser doesn't support camera access.",
        variant: "destructive",
      });
    }
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
