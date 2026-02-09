import { useNavigate } from "react-router-dom";
import { Brain, Mic, BarChart3, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto border-b border-border">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold">IntervAI</span>
        </div>
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-muted-foreground">
          Dashboard
        </Button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-20 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            IntervAI – AI Mock Interview Platform
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Practice interviews using speech-based responses and AI-driven feedback.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/interview")}
            className="text-base px-8 py-5 rounded-lg"
          >
            Start Interview
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Mic, title: "Speech Input", desc: "Answer questions using your voice with real-time transcription" },
            { icon: BarChart3, title: "AI Scoring", desc: "Get scored on clarity, confidence, and keyword coverage" },
            { icon: MessageSquare, title: "Instant Feedback", desc: "Receive actionable recommendations to improve" },
          ].map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-lg p-6 card-shadow">
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
