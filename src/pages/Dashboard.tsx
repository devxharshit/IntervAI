import { useNavigate } from "react-router-dom";
import { Brain, ChevronLeft, BarChart3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Your interview history and progress</p>
          </div>
          {sessions.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center card-shadow">
            <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-2">No interviews yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Complete your first mock interview to see your progress.</p>
            <Button onClick={() => navigate("/interview")}>Start Interview</Button>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Sessions", value: sessions.length },
                { label: "Avg Score", value: Math.round(sessions.reduce((s, x) => s + x.averageScore, 0) / sessions.length) },
                { label: "Questions", value: sessions.reduce((s, x) => s + x.questions.length, 0) },
                { label: "Best Score", value: Math.max(...sessions.map((s) => s.averageScore)) },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-lg p-4 text-center card-shadow">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Session table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden card-shadow">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Session ID</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Score</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Confidence</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/results/${session.id}`)}
                    >
                      <td className="px-4 py-3 text-muted-foreground">#{session.id.slice(-6)}</td>
                      <td className="px-4 py-3">{session.category}</td>
                      <td className={`px-4 py-3 font-semibold ${scoreColor(session.averageScore)}`}>{session.averageScore}</td>
                      <td className="px-4 py-3">
                        {session.averageScore >= 70 ? "High" : session.averageScore >= 40 ? "Medium" : "Low"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{session.overallPerformance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
