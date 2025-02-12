
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    return savedMessages ? JSON.parse(savedMessages) : [{
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    }];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    localStorage.setItem('chat-messages', JSON.stringify(newMessages));

    // Simulate AI response with more realistic messages
    const aiResponses = [
      "I understand your question. Let me help you with that.",
      "That's an interesting point. Here's what I think...",
      "Based on what you're asking, I would suggest...",
      "I can help you with that. Here's my recommendation...",
    ];

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      localStorage.setItem('chat-messages', JSON.stringify(updatedMessages));
      setIsProcessing(false);
    }, 1000);

    setInputMessage('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className={`p-4 glass animate-fadeIn ${
              message.sender === 'user' ? 'ml-auto bg-primary/10' : ''
            } max-w-[80%]`}
          >
            <p className="text-sm">{message.content}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          </Card>
        ))}
      </div>
      <div className="p-4 glass rounded-lg">
        <form className="flex gap-2" onSubmit={handleSendMessage}>
          <Input
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
