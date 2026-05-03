export type ProjectTrack = "LLM/RAG" | "Agentic" | "MLOps" | "Automation" | "All";

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  track: ProjectTrack;
  flagship?: boolean;
  github?: string;
  production?: string;
  featured: boolean;
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: "proj-1",
    name: "Slate PM",
    description:
      "Professional Kanban project management with AI-powered task generation, complexity analysis, and smart categorization. Real-time sync via Supabase.",
    tech: ["Next.js 15", "TypeScript", "Supabase", "Tailwind CSS 4", "OpenRouter AI"],
    track: "Agentic",
    flagship: true,
    github: "https://github.com/MrPwill/slate-pm",
    production: "https://slate-pm.vercel.app",
    featured: true,
    highlights: [
      "5-column Kanban workflow: Backlog → Todo → In Progress → Review → Done",
      "AI task generation transforms high-level goals into granular actionable items",
      "Local-first architecture with Zustand + localStorage, synced via Supabase",
      "Row Level Security (RLS) policies for data isolation at database level",
    ],
  },
  {
    id: "proj-2",
    name: "ClauseGuard Africa",
    description:
      "Jurisdiction-aware legal document platform for African freelancers and SMEs. AI-powered questionnaire with PDF export and e-signatures.",
    tech: ["Next.js 16", "TypeScript", "Supabase", "OpenRouter", "@react-pdf/renderer"],
    track: "LLM/RAG",
    flagship: true,
    github: "https://github.com/MrPwill/clause_guard",
    production: "https://clause-guard-chi.vercel.app",
    featured: true,
    highlights: [
      "Multi-jurisdiction support: Nigeria (CAMA 2020, NDPR), Kenya, Ghana, South Africa",
      "AI-powered plain-language questionnaire converts user input to legal documents",
      "E-signatures with react-signature-canvas + branded PDF export via @react-pdf/renderer",
      "Server-side API key management with signed storage URLs for secure document access",
    ],
  },
  {
    id: "proj-3",
    name: "AI SDR Platform",
    description:
      "Production-grade autonomous outbound revenue engine with multi-agent orchestration, ICP scoring, and webhook-driven reply handling.",
    tech: ["Python 3.12", "OpenAI", "SendGrid", "Serper API", "SQLite"],
    track: "Agentic",
    flagship: true,
    github: "https://github.com/MrPwill/ai_sdr_agent",
    featured: true,
    highlights: [
      "6-agent pipeline: Lead Researcher → CRM Dedup → ICP Scorer → Qualification → Sales Manager → Email Manager",
      "Serper API integration for automated prospect discovery",
      "ICP scoring against configurable rules defined in YAML",
      "Webhook-driven reply classification with conversation management",
    ],
  },
  {
    id: "proj-4",
    name: "AI Customer Support Agent",
    description:
      "Intelligent function-calling AI agent handling order tracking, ticket management, and profile updates with real-time SQLite persistence.",
    tech: ["Python", "FastAPI", "OpenAI GPT-4", "SQLite"],
    track: "Agentic",
    github: "https://github.com/MrPwill/AI-Customer-Support-Agent",
    featured: false,
    highlights: [
      "Real-time order status checking with shipping/delivery details via function calling",
      "Support ticket creation and status tracking with persistent storage",
      "Secure user profile updates with validation and error handling",
      "GPT-4 function calling with structured JSON output parsing",
    ],
  },
  {
    id: "proj-5",
    name: "Synthetic Data Generator",
    description:
      "Multi-agent platform for generating validated synthetic datasets. Self-correcting generator-judge-refiner loop with Gradio UI.",
    tech: ["Python 3.12", "Gradio", "OpenRouter", "Pydantic", "SQLAlchemy"],
    track: "LLM/RAG",
    github: "https://github.com/MrPwill/pwill_synthetic_data_generator",
    featured: false,
    highlights: [
      "Self-correcting agent loop: Generator → Judge → Refiner → Validated Output",
      "Multi-model support via OpenRouter (Llama 3, Mistral, DeepSeek, Qwen)",
      "Strict JSON schema validation with logical correctness checks",
      "SQLite persistence for auditability, run history, and prompt versioning",
    ],
  },
  {
    id: "proj-6",
    name: "AI-JobFitAnalyzer",
    description:
      "AI-powered resume-job matching tool that helps jobseekers tailor CVs to specific job descriptions using Gemini API analysis.",
    tech: ["TypeScript", "React", "Vite", "Gemini API"],
    track: "LLM/RAG",
    github: "https://github.com/MrPwill/AI-JobFitAnalyzer",
    featured: false,
    highlights: [
      "CV-to-job matching analysis using Google Gemini API",
      "Keyword extraction and gap analysis between resume and job description",
      "Tailored suggestions for improving resume content",
      "Early-stage with Vite + React + TypeScript scaffold",
    ],
  },
  {
    id: "proj-7",
    name: "Digital Twin Portfolio",
    description:
      "A modern full-stack portfolio featuring an interactive AI agent (Digital Twin) that answers recruiter questions and streams real-time responses based on my professional profile.",
    tech: ["Next.js 16", "Tailwind v4", "FastAPI", "Python", "OpenRouter"],
    track: "Agentic",
    flagship: true,
    github: "https://github.com/MrPwill/princewill-site-with-digital-twin--vercel",
    production: "https://princewill-digital-twin.vercel.app/twin",
    featured: true,
    highlights: [
      "Stateless Python FastAPI backend optimized for Vercel Serverless with client-managed conversation history",
      "Server-Sent Events (SSE) streaming for real-time, token-by-token AI responses",
      "Dynamic prompt building and context-aware responses powered by openai/gpt-4o-mini via OpenRouter",
      "Modern Next.js 16 App Router frontend with Tailwind CSS v4 and Framer Motion for a premium UI experience",
    ],
  },
];

export const tracks: ProjectTrack[] = ["All", "LLM/RAG", "Agentic", "MLOps", "Automation"];