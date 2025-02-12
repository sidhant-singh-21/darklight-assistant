
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

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Input Unavailable",
        description: "Your browser doesn't support voice input. Please try using Chrome.",
        variant: "destructive",
      });
      return;
    }

    try {
      const SpeechRecognitionAPI = (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor;
      const recognition = new SpeechRecognitionAPI();
      
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      let currentMessageId: string | null = null;

      recognition.onstart = () => {
        toast({
          title: "Listening...",
          description: "Speak now",
        });
        
        // Add an initial message for interim results
        const messages = JSON.parse(localStorage.getItem('chat-messages') || '[]');
        currentMessageId = Date.now().toString();
        const newMessage = {
          id: currentMessageId,
          content: "Listening...",
          sender: 'user' as const,
          timestamp: new Date(),
        };
        messages.push(newMessage);
        localStorage.setItem('chat-messages', JSON.stringify(messages));
        navigate(0);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const messages = JSON.parse(localStorage.getItem('chat-messages') || '[]');
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        if (currentMessageId) {
          // Update the existing message with new transcript
          const updatedMessages = messages.map(message => 
            message.id === currentMessageId
              ? { ...message, content: transcript }
              : message
          );
          localStorage.setItem('chat-messages', JSON.stringify(updatedMessages));
          navigate(0);
        }

        // If this is the final result
        if (event.results[event.results.length - 1].isFinal) {
          currentMessageId = null;
          recognition.stop();
          toast({
            title: "Voice Input Received",
            description: "Your message has been added to the chat.",
          });
        }
      };

      recognition.onerror = (event: Event & { error: string }) => {
        toast({
          title: "Error",
          description: "There was an error with voice recognition: " + event.error,
          variant: "destructive",
        });
        currentMessageId = null;
        recognition.stop();
      };

      recognition.onend = () => {
        if (currentMessageId) {
          const messages = JSON.parse(localStorage.getItem('chat-messages') || '[]');
          const finalMessages = messages.filter(message => message.id !== currentMessageId);
          localStorage.setItem('chat-messages', JSON.stringify(finalMessages));
          navigate(0);
        }
      };

      recognition.start();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start voice recognition",
        variant: "destructive",
      });
    }
  };

  const handleCameraInput = async () => {
    if (!('mediaDevices' in navigator)) {
      toast({
        title: "Camera Unavailable",
        description: "Your browser doesn't support camera access.",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      videoElement.srcObject = stream;
      await videoElement.play();

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg');

      stream.getTracks().forEach(track => track.stop());

      const messages = JSON.parse(localStorage.getItem('chat-messages') || '[]');
      const newMessage = {
        id: Date.now().toString(),
        content: `<img src="${imageData}" alt="Captured image" class="max-w-full h-auto rounded-lg" />`,
        sender: 'user' as const,
        timestamp: new Date(),
      };
      
      messages.push(newMessage);
      localStorage.setItem('chat-messages', JSON.stringify(messages));
      navigate(0);

      toast({
        title: "Image Captured",
        description: "Your image has been added to the chat.",
      });
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Failed to access camera: " + (error as Error).message,
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
