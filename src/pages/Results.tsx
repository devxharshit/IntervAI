import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, ChevronLeft, TrendingUp, Shield, MessageSquare, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSessions } from "@/lib/ai-engine";

const scoreColor = (score: number) =>
  score >= 70 ? "text-success" : score >= 40 ? "text-warning" : "text-destructive";

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSessions().find((s) => s.id === id);

  if (!session) {
    return (
      <div className="min-h-screen bg-hero flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Session not found</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

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
        {/* Score Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 md:p-12 text-center mb-10"
        >
          <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider font-mono">Overall Score</p>
          <div className={`text-7xl md:text-8xl font-bold font-mono ${scoreColor(session.averageScore)}`}>
            {session.averageScore}
          </div>
          <p className="text-muted-foreground mt-1">out of 100</p>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <Badge variant="secondary">{session.category}</Badge>
            <Badge variant="outline">{session.overallPerformance}</Badge>
            <Badge variant="outline">{session.questions.length} Questions</Badge>
          </div>
        </motion.div>

        {/* Per-question results */}
        <div className="space-y-4">
          {session.questions.map((q, i) => (
            <motion.div
              key={q.questionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-primary font-mono mb-1">Q{i + 1}</p>
                  <h3 className="font-semibold">{q.question}</h3>
                </div>
                <span className={`text-2xl font-bold font-mono ${scoreColor(q.result.score)}`}>
                  {q.result.score}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4 italic">"{q.answer}"</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Shield className="w-3 h-3" /> Confidence
                  </div>
                  <p className="font-semibold text-sm">{q.result.confidence}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Target className="w-3 h-3" /> Keywords
                  </div>
                  <p className="font-semibold text-sm">{q.result.keywordCoverage}%</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="w-3 h-3" /> Clarity
                  </div>
                  <p className="font-semibold text-sm">{q.result.clarityScore}%</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <MessageSquare className="w-3 h-3" /> Nervousness
                  </div>
                  <p className="font-semibold text-sm">{q.result.nervousnessLevel}</p>
                </div>
              </div>

              <p className="text-sm mb-3">{q.result.feedback}</p>
              <div className="space-y-1">
                {q.result.recommendations.map((rec, j) => (
                  <p key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span> {rec}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 mt-10 justify-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>View Dashboard</Button>
          <Button onClick={() => navigate("/interview")} className="shadow-glow">Practice Again</Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
