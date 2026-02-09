import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, ChevronLeft, Calendar, BarChart3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSessions } from "@/lib/ai-engine";
import { useState } from "react";

const scoreColor = (score: number) =>
  score >= 70 ? "text-success" : score >= 40 ? "text-warning" : "text-destructive";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(getSessions());

  const clearHistory = () => {
    localStorage.removeItem("intervai_sessions");
    setSessions([]);
  };

  return (
    <div className="min-h-screen bg-hero">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <span className="font-semibold">IntervAI</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="w-4 h-4 mr-1" /> Home
        </Button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Your interview history and progress</p>
          </div>
          {sessions.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        {/* Stats */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Sessions", value: sessions.length },
              { label: "Avg Score", value: Math.round(sessions.reduce((s, x) => s + x.averageScore, 0) / sessions.length) },
              { label: "Questions", value: sessions.reduce((s, x) => s + x.questions.length, 0) },
              { label: "Best Score", value: Math.max(...sessions.map((s) => s.averageScore)) },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-5 text-center">
                <p className="text-2xl font-bold font-mono">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-16 text-center"
          >
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No interviews yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Complete your first mock interview to see your progress.</p>
            <Button onClick={() => navigate("/interview")} className="shadow-glow">Start Interview</Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-5 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/results/${session.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold font-mono ${scoreColor(session.averageScore)}`}>
                      {session.averageScore}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="secondary" className="text-xs">{session.category}</Badge>
                        <Badge variant="outline" className="text-xs">{session.overallPerformance}</Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(session.date).toLocaleDateString()} — {session.questions.length} questions
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
