import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary/80 bg-[length:200%_200%] animate-[gradient_15s_ease_infinite] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-12 text-center rounded-3xl shadow-2xl animate-in zoom-in-95">
        <div className="text-8xl mb-6 animate-bounce">🎟️</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          Queue Joy
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Modern queue management system for seamless customer service
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/counter-dashboard")}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <span className="text-2xl mr-2">🎯</span>
            Staff Dashboard
          </Button>
          
          <Button
            onClick={() => alert("Customer view coming soon!")}
            size="lg"
            variant="outline"
            className="font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <span className="text-2xl mr-2">👥</span>
            Customer View
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="font-semibold text-lg mb-4">Key Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">Real-time Updates</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-2">📱</div>
              <div className="font-semibold">Telegram Alerts</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-semibold">Beautiful UI</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
