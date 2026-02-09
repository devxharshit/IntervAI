import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Clock, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { questions, type Question } from "@/data/questions";
import { analyzeAnswer, saveSession, type InterviewSession, type AnalysisResult } from "@/lib/ai-engine";

const CATEGORIES = ["All", ...Array.from(new Set(questions.map((q) => q.category)))];
const TIME_PER_QUESTION = 120; // seconds

const Interview = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{ questionId: number; question: string; answer: string; result: AnalysisResult }[]>([]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startInterview = (cat: string) => {
    setCategory(cat);
    const qs = cat === "All" ? questions : questions.filter((q) => q.category === cat);
    // Pick up to 5 random questions
    const shuffled = [...qs].sort(() => Math.random() - 0.5).slice(0, 5);
    setFilteredQuestions(shuffled);
    setCurrentIndex(0);
    setResults([]);
    setAnswer("");
    setTimeLeft(TIME_PER_QUESTION);
    setIsRunning(true);
  };

  const submitAnswer = useCallback(() => {
    if (!filteredQuestions[currentIndex]) return;
    const q = filteredQuestions[currentIndex];
    const result = analyzeAnswer(q.id, answer);
    const newResults = [...results, { questionId: q.id, question: q.question, answer, result }];
    setResults(newResults);

    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setTimeLeft(TIME_PER_QUESTION);
    } else {
      // Save session and navigate to results
      const avgScore = Math.round(newResults.reduce((s, r) => s + r.result.score, 0) / newResults.length);
      const session: InterviewSession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        category: category || "All",
        questions: newResults,
        averageScore: avgScore,
        overallPerformance: avgScore < 40 ? "Needs Improvement" : avgScore <= 70 ? "Average" : "Good",
      };
      saveSession(session);
      navigate(`/results/${session.id}`);
    }
  }, [answer, currentIndex, filteredQuestions, results, category, navigate]);

  // Auto-submit on time out
  useEffect(() => {
    if (timeLeft === 0 && isRunning) submitAnswer();
  }, [timeLeft, isRunning, submitAnswer]);

  const currentQ = filteredQuestions[currentIndex];
  const progress = filteredQuestions.length > 0 ? ((currentIndex + 1) / filteredQuestions.length) * 100 : 0;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Category selection
  if (!category) {
    return (
      <div className="min-h-screen bg-hero">
        <nav className="flex items-center gap-2 px-6 py-4 max-w-4xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </nav>
        <div className="max-w-2xl mx-auto px-6 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Choose a Category</h1>
            <p className="text-muted-foreground mb-10">Select a topic to start your mock interview session.</p>
            <div className="grid gap-3">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => startInterview(cat)}
                  className="glass rounded-xl p-5 text-left hover:border-primary/40 transition-colors"
                >
                  <span className="font-semibold">{cat}</span>
                  <span className="text-sm text-muted-foreground ml-3">
                    {cat === "All" ? questions.length : questions.filter((q) => q.category === cat).length} questions
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero">
      {/* Top bar */}
      <div className="border-b border-border/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold">IntervAI</span>
            <Badge variant="secondary" className="text-xs">{category}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {filteredQuestions.length}
            </span>
            <div className={`flex items-center gap-1.5 font-mono text-sm ${timeLeft < 30 ? "text-destructive" : "text-muted-foreground"}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-secondary">
          <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs uppercase tracking-wider text-primary mb-4 font-mono">
              Question {currentIndex + 1}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              {currentQ?.question}
            </h2>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[200px] bg-card/50 border-border/50 text-base resize-none focus:ring-primary/30"
              autoFocus
            />
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-muted-foreground font-mono">
                {answer.split(/\s+/).filter(Boolean).length} words
              </p>
              <Button onClick={submitAnswer} disabled={!answer.trim()} size="lg" className="shadow-glow">
                {currentIndex + 1 < filteredQuestions.length ? (
                  <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
                ) : (
                  "Finish Interview"
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Interview;
