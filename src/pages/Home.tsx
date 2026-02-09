import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Target, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Brain, title: "AI-Powered Analysis", desc: "Rule-based NLP evaluates your answers against ideal responses" },
  { icon: Target, title: "Keyword Matching", desc: "Smart detection of relevant concepts and technical terms" },
  { icon: BarChart3, title: "Detailed Scoring", desc: "Get scored on clarity, confidence, and content coverage" },
  { icon: Zap, title: "Instant Feedback", desc: "Actionable recommendations to improve your interview skills" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hero">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Brain className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold font-display">IntervAI</span>
        </div>
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
          Dashboard
        </Button>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8">
            <Zap className="w-3.5 h-3.5 text-primary" />
            AI-Powered Mock Interviews
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Ace Your Next
            <br />
            <span className="text-gradient">Interview</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Practice with AI-analyzed mock interviews. Get instant scoring, confidence analysis, and personalized feedback to land your dream role.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              onClick={() => navigate("/interview")}
              className="text-lg px-10 py-6 shadow-glow"
            >
              Start Mock Interview
            </Button>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-28"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <f.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
