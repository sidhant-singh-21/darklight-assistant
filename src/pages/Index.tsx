
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";

const Index = () => {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-1 space-y-4 overflow-auto p-4">
        <Card className="p-4 glass animate-fadeIn">
          <p className="text-sm">
            Hello! I'm your AI assistant. How can I help you today?
          </p>
        </Card>
      </div>
      <div className="p-4 glass rounded-lg">
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;
