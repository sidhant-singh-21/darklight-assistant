import { Mic, Camera, User, RotateCcw, Plus } from "lucide-react";
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

// 🔁 Talk to your LLaMA 2 backend
async function fetchLlamaResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data.response || "🤖 (No reply from LLaMA)";
  } catch (err) {
    console.error("LLaMA API error:", err);
    return "❌ Failed to get response from LLaMA.";
  }
}

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNewChat = () => {
    localStorage.removeItem("chat-messages");
    toast({
      title: "New Chat",
      description: "Starting a new conversation.",
    });
    navigate("/"); // ✅ Always go to the homepage (chat interface)
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleResetChat = () => {
    localStorage.removeItem("chat-messages");
    toast({
      title: "Chat Reset",
      description: "Chat history has been cleared.",
    });
    navigate(0);
  };

  const handleVoiceInput = async () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast({
        title: "Voice Input Unavailable",
        description: "Your browser doesn't support voice input. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    try {
      const SpeechRecognitionAPI = (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor;
      const recognition = new SpeechRecognitionAPI();

      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      toast({
        title: "🎙️ Listening...",
        description: "Speak now...",
      });

      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("")
          .trim();

        if (transcript) {
          const messages = JSON.parse(localStorage.getItem("chat-messages") || "[]");

          const userMessage = {
            id: Date.now().toString(),
            content: transcript,
            sender: "user" as const,
            timestamp: new Date().toISOString(),
          };

          messages.push(userMessage);
          localStorage.setItem("chat-messages", JSON.stringify(messages));
          navigate(0);

          const botReply = await fetchLlamaResponse(transcript);

          const botMessage = {
            id: (Date.now() + 1).toString(),
            content: botReply,
            sender: "bot" as const,
            timestamp: new Date().toISOString(),
          };

          messages.push(botMessage);
          localStorage.setItem("chat-messages", JSON.stringify(messages));
          navigate(0);

          toast({
            title: "🤖 LLaMA Replied",
            description: "Check the chat window for the response.",
          });
        }
      };

      recognition.onerror = (event: any) => {
        toast({
          title: "Speech Recognition Error",
          description: event.error,
          variant: "destructive",
        });
      };

      recognition.start();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while starting voice input.",
        variant: "destructive",
      });
    }
  };

  const handleCameraInput = async () => {
    if (!("mediaDevices" in navigator)) {
      toast({
        title: "Camera Unavailable",
        description: "Your browser doesn't support camera access.",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement("video");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      videoElement.srcObject = stream;
      await videoElement.play();

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg");
      stream.getTracks().forEach((track) => track.stop());

      const messages = JSON.parse(localStorage.getItem("chat-messages") || "[]");

      const newMessage = {
        id: Date.now().toString(),
        content: `<img src="${imageData}" alt="Captured image" class="max-w-full h-auto rounded-lg" />`,
        sender: "user" as const,
        timestamp: new Date().toISOString(),
      };

      messages.push(newMessage);
      localStorage.setItem("chat-messages", JSON.stringify(messages));
      navigate(0);

      toast({
        title: "📸 Image Captured",
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
    { title: "New Chat", icon: Plus, onClick: handleNewChat },
    { title: "Profile", icon: User, onClick: handleProfileClick },
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
