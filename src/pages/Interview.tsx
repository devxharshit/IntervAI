import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Clock, ArrowRight, ChevronLeft, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { questions, type Question } from "@/data/questions";
import { analyzeAnswer, saveSession, type InterviewSession, type AnalysisResult } from "@/lib/ai-engine";

const CATEGORIES = ["All", ...Array.from(new Set(questions.map((q) => q.category)))];
const TIME_PER_QUESTION = 120;

const Interview = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{ questionId: number; question: string; answer: string; result: AnalysisResult }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleSpeech = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = answer;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setAnswer(finalTranscript + interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, answer]);

  const startInterview = (cat: string) => {
    setCategory(cat);
    const qs = cat === "All" ? questions : questions.filter((q) => q.category === cat);
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
    recognitionRef.current?.stop();
    setIsListening(false);

    const q = filteredQuestions[currentIndex];
    const result = analyzeAnswer(q.id, answer);
    const newResults = [...results, { questionId: q.id, question: q.question, answer, result }];
    setResults(newResults);

    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setTimeLeft(TIME_PER_QUESTION);
    } else {
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

  useEffect(() => {
    if (timeLeft === 0 && isRunning) submitAnswer();
  }, [timeLeft, isRunning, submitAnswer]);

  const currentQ = filteredQuestions[currentIndex];
  const progress = filteredQuestions.length > 0 ? ((currentIndex + 1) / filteredQuestions.length) * 100 : 0;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Category selection screen
  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="flex items-center gap-2 px-6 py-4 max-w-4xl mx-auto border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </nav>
        <div className="max-w-2xl mx-auto px-6 pt-12">
          <h1 className="text-2xl font-bold mb-2">Choose a Category</h1>
          <p className="text-muted-foreground mb-8">Select a topic to start your mock interview session.</p>
          <div className="grid gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => startInterview(cat)}
                className="bg-card border border-border rounded-lg p-4 text-left hover:border-primary/50 transition-colors card-shadow"
              >
                <span className="font-semibold">{cat}</span>
                <span className="text-sm text-muted-foreground ml-3">
                  {cat === "All" ? questions.length : questions.filter((q) => q.category === cat).length} questions
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
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
            <div className={`flex items-center gap-1.5 text-sm ${timeLeft < 30 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-20">
        <p className="text-xs uppercase tracking-wider text-primary mb-3 font-medium">
          Question {currentIndex + 1}
        </p>
        <h2 className="text-2xl font-bold mb-6">{currentQ?.question}</h2>

        {/* Speech button */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant={isListening ? "destructive" : "outline"}
            onClick={toggleSpeech}
            className="gap-2"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isListening ? "Stop Speaking" : "Start Speaking"}
          </Button>
          {isListening && (
            <span className="text-sm text-primary font-medium">Listening...</span>
          )}
        </div>

        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer will appear here (or type manually)..."
          className="min-h-[180px] text-base resize-none bg-card border-border"
        />

        <div className="flex items-center justify-between mt-5">
          <p className="text-xs text-muted-foreground">
            {answer.split(/\s+/).filter(Boolean).length} words
          </p>
          <Button onClick={submitAnswer} disabled={!answer.trim()} size="lg">
            {currentIndex + 1 < filteredQuestions.length ? (
              <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
            ) : (
              "Submit Answer"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Interview;
