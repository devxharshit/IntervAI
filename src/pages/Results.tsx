import { useParams, useNavigate } from "react-router-dom";
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Session not found</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-border">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <span className="font-semibold">IntervAI</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="w-4 h-4 mr-1" /> Home
        </Button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-8 pb-20">
        {/* Score card */}
        <div className="bg-card border border-border rounded-lg p-8 text-center mb-8 card-shadow">
          <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Overall Score</p>
          <div className={`text-6xl font-bold ${scoreColor(session.averageScore)}`}>
            {session.averageScore}
          </div>
          <p className="text-muted-foreground mt-1">out of 100</p>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <Badge variant="secondary">{session.category}</Badge>
            <Badge variant="outline">{session.overallPerformance}</Badge>
            <Badge variant="outline">{session.questions.length} Questions</Badge>
          </div>
        </div>

        {/* Per-question results */}
        <div className="space-y-4">
          {session.questions.map((q, i) => (
            <div key={q.questionId} className="bg-card border border-border rounded-lg p-6 card-shadow">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-primary font-medium mb-1">Q{i + 1}</p>
                  <h3 className="font-semibold">{q.question}</h3>
                </div>
                <span className={`text-2xl font-bold ${scoreColor(q.result.score)}`}>
                  {q.result.score}
                </span>
              </div>

              <div className="bg-muted rounded-md p-3 mb-4">
                <p className="text-sm text-muted-foreground italic">"{q.answer}"</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { icon: Shield, label: "Confidence", value: q.result.confidence },
                  { icon: Target, label: "Keywords", value: `${q.result.keywordCoverage}%` },
                  { icon: TrendingUp, label: "Clarity", value: `${q.result.clarityScore}%` },
                  { icon: MessageSquare, label: "Nervousness", value: q.result.nervousnessLevel },
                ].map((m) => (
                  <div key={m.label} className="bg-secondary rounded-md p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <m.icon className="w-3 h-3" /> {m.label}
                    </div>
                    <p className="font-semibold text-sm">{m.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm mb-3">{q.result.feedback}</p>
              <div className="space-y-1">
                {q.result.recommendations.map((rec, j) => (
                  <p key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span> {rec}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8 justify-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          <Button onClick={() => navigate("/interview")}>Practice Again</Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
