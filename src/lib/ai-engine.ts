import { idealAnswers } from "@/data/questions";

const FILLER_WORDS = ["um", "uh", "like", "basically", "actually", "literally", "you know", "i mean", "sort of", "kind of", "well", "so", "just"];

export interface AnalysisResult {
  score: number;
  confidence: "Low" | "Medium" | "High";
  keywordCoverage: number;
  clarityScore: number;
  nervousnessLevel: "Low" | "Medium" | "High";
  feedback: string;
  recommendations: string[];
  performanceLevel: string;
}

export function analyzeAnswer(questionId: number, userAnswer: string): AnalysisResult {
  const ideal = idealAnswers.find((a) => a.questionId === questionId);
  if (!ideal) {
    return {
      score: 0, confidence: "Low", keywordCoverage: 0, clarityScore: 0,
      nervousnessLevel: "High", feedback: "Question not found.", recommendations: [],
      performanceLevel: "Needs Improvement",
    };
  }

  const answer = userAnswer.toLowerCase().trim();
  const words = answer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Keyword matching
  const matchedKeywords = ideal.keywords.filter((kw) => answer.includes(kw.toLowerCase()));
  const keywordCoverage = matchedKeywords.length / ideal.keywords.length;

  // Length-based confidence
  let lengthScore = 0;
  if (wordCount < 10) lengthScore = 10;
  else if (wordCount < 30) lengthScore = 30;
  else if (wordCount < 60) lengthScore = 60;
  else if (wordCount < 120) lengthScore = 85;
  else lengthScore = 95;

  // Filler word detection
  const fillerCount = FILLER_WORDS.reduce((count, filler) => {
    const regex = new RegExp(`\\b${filler}\\b`, "gi");
    return count + (answer.match(regex)?.length || 0);
  }, 0);
  const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0;

  // Clarity (keyword coverage weighted)
  const clarityScore = Math.round(keywordCoverage * 100);

  // Nervousness
  const nervousnessLevel: "Low" | "Medium" | "High" =
    fillerRatio > 0.1 ? "High" : fillerRatio > 0.05 ? "Medium" : "Low";

  // Confidence
  const confidence: "Low" | "Medium" | "High" =
    wordCount < 15 ? "Low" : wordCount < 50 ? "Medium" : "High";

  // Final score
  const keywordScore = keywordCoverage * 50;
  const structureScore = lengthScore * 0.3;
  const fillerPenalty = fillerRatio * 30;
  const score = Math.min(100, Math.max(0, Math.round(keywordScore + structureScore - fillerPenalty)));

  // Performance level and feedback
  let performanceLevel: string;
  let feedback: string;
  if (score < 40) {
    performanceLevel = "Needs Improvement";
    feedback = "Your answer lacks key concepts. Focus on covering the main points and providing specific examples to strengthen your response.";
  } else if (score <= 70) {
    performanceLevel = "Average Performance";
    feedback = "You covered some key points but could improve by being more detailed and structured. Use the STAR method for behavioral questions.";
  } else {
    performanceLevel = "Good Performance";
    feedback = "Strong answer with good keyword coverage and structure. Continue refining your delivery for even better results.";
  }

  // Recommendations
  const recommendations: string[] = [];
  if (keywordCoverage < 0.4) recommendations.push("Include more relevant keywords and technical terms in your answer.");
  if (wordCount < 30) recommendations.push("Provide more detailed responses — aim for at least 50-80 words.");
  if (fillerRatio > 0.05) recommendations.push("Reduce filler words (um, like, basically) to sound more confident.");
  if (confidence === "Low") recommendations.push("Elaborate on your points with specific examples and experiences.");
  if (keywordCoverage >= 0.6 && wordCount >= 50) recommendations.push("Great coverage! Try adding a personal anecdote to make it memorable.");
  if (recommendations.length === 0) recommendations.push("Excellent response! Practice delivering it naturally for maximum impact.");

  return { score, confidence, keywordCoverage: Math.round(keywordCoverage * 100), clarityScore, nervousnessLevel, feedback, recommendations, performanceLevel };
}

export interface InterviewSession {
  id: string;
  date: string;
  category: string;
  questions: { questionId: number; question: string; answer: string; result: AnalysisResult }[];
  averageScore: number;
  overallPerformance: string;
}

export function saveSession(session: InterviewSession) {
  const sessions = getSessions();
  sessions.unshift(session);
  localStorage.setItem("intervai_sessions", JSON.stringify(sessions));
}

export function getSessions(): InterviewSession[] {
  const data = localStorage.getItem("intervai_sessions");
  return data ? JSON.parse(data) : [];
}
