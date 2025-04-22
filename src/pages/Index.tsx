import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);  // Ref for the input field

  // Load messages on first render
  useEffect(() => {
    const stored = localStorage.getItem("chat-messages");
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const welcome: Message = {
        id: Date.now().toString(),
        content: "👋 Hi there! How can I help you today?",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
      localStorage.setItem("chat-messages", JSON.stringify([welcome]));
    }
  }, []);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Focus the input field after a message is sent
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim()) {
      toast({
        title: "Empty message",
        description: "Please type something before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    localStorage.setItem("chat-messages", JSON.stringify(newMsgs));

    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama2-uncensored",
          prompt: inputMessage,
          stream: false,
        }),
      });

      const data = await res.json();
      const aiResponse = data.response || "🤖 No reply from AI.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      const updatedMsgs = [...newMsgs, aiMsg];
      setMessages(updatedMsgs);
      localStorage.setItem("chat-messages", JSON.stringify(updatedMsgs));
    } catch (err) {
      console.error("API Error:", err);
      toast({
        title: "Error",
        description: "Could not reach the AI model.",
        variant: "destructive",
      });
    }

    setInputMessage("");
    setIsProcessing(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Chat Display */}
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`p-4 glass animate-fadeIn ${
              msg.sender === "user" ? "ml-auto bg-primary/10" : ""
            } max-w-[80%]`}
          >
            {msg.content.startsWith("<img") ? (
              <div dangerouslySetInnerHTML={{ __html: msg.content }} />
            ) : (
              <p className="text-sm">{msg.content}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </Card>
        ))}
        {/* This div will be used to auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-4 glass rounded-lg">
        <form className="flex gap-2" onSubmit={handleSendMessage}>
          <Input
            ref={inputRef} // Assign ref to the input field
            placeholder="Type your message..."
            className="flex-1"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isProcessing}
          />
          <Button type="submit" disabled={isProcessing}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;
