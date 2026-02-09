export interface Question {
  id: number;
  question: string;
  category: string;
}

export interface IdealAnswer {
  questionId: number;
  idealAnswer: string;
  keywords: string[];
}

export const questions: Question[] = [
  { id: 1, question: "Tell me about yourself and your professional background.", category: "General" },
  { id: 2, question: "What are your greatest strengths?", category: "General" },
  { id: 3, question: "Where do you see yourself in 5 years?", category: "General" },
  { id: 4, question: "Describe a challenging situation you faced and how you handled it.", category: "Behavioral" },
  { id: 5, question: "How do you handle working under pressure?", category: "Behavioral" },
  { id: 6, question: "Tell me about a time you showed leadership.", category: "Behavioral" },
  { id: 7, question: "What is Object-Oriented Programming?", category: "Technical" },
  { id: 8, question: "Explain the difference between a stack and a queue.", category: "Technical" },
  { id: 9, question: "What is the importance of data structures in software development?", category: "Technical" },
  { id: 10, question: "Why should we hire you?", category: "General" },
  { id: 11, question: "How do you prioritize tasks when you have multiple deadlines?", category: "Behavioral" },
  { id: 12, question: "What is a REST API and how does it work?", category: "Technical" },
];

export const idealAnswers: IdealAnswer[] = [
  { questionId: 1, idealAnswer: "A concise summary of education, experience, skills, and career goals.", keywords: ["experience", "education", "skills", "background", "career", "professional", "degree", "university", "project", "work"] },
  { questionId: 2, idealAnswer: "Specific strengths with examples demonstrating them.", keywords: ["strength", "problem-solving", "communication", "teamwork", "leadership", "adaptable", "detail", "organized", "analytical", "creative"] },
  { questionId: 3, idealAnswer: "Clear vision aligned with role and company growth.", keywords: ["growth", "career", "goal", "develop", "leadership", "contribute", "learn", "advance", "role", "skill"] },
  { questionId: 4, idealAnswer: "STAR method response showing problem-solving ability.", keywords: ["challenge", "situation", "action", "result", "solution", "resolved", "overcome", "team", "approach", "learned"] },
  { questionId: 5, idealAnswer: "Strategies for managing stress and maintaining productivity.", keywords: ["pressure", "prioritize", "deadline", "organize", "calm", "focus", "manage", "stress", "plan", "efficient"] },
  { questionId: 6, idealAnswer: "Specific leadership example with positive outcomes.", keywords: ["leadership", "team", "initiative", "guide", "decision", "responsibility", "motivate", "delegate", "project", "outcome"] },
  { questionId: 7, idealAnswer: "Explanation of OOP concepts with examples.", keywords: ["class", "object", "inheritance", "encapsulation", "polymorphism", "abstraction", "method", "instance", "reusable", "modular"] },
  { questionId: 8, idealAnswer: "Clear comparison of stack (LIFO) and queue (FIFO).", keywords: ["stack", "queue", "LIFO", "FIFO", "push", "pop", "enqueue", "dequeue", "first", "last"] },
  { questionId: 9, idealAnswer: "Explanation of efficiency, organization, and optimization.", keywords: ["efficiency", "data", "algorithm", "organize", "performance", "optimize", "search", "sort", "complexity", "structure"] },
  { questionId: 10, idealAnswer: "Unique value proposition aligned with role requirements.", keywords: ["value", "skill", "experience", "contribute", "passionate", "fit", "unique", "quality", "deliver", "team"] },
  { questionId: 11, idealAnswer: "Systematic approach to task management and prioritization.", keywords: ["prioritize", "deadline", "urgent", "important", "organize", "schedule", "plan", "communicate", "manage", "time"] },
  { questionId: 12, idealAnswer: "Explanation of REST principles, HTTP methods, and API design.", keywords: ["REST", "API", "HTTP", "GET", "POST", "endpoint", "request", "response", "resource", "JSON"] },
];
