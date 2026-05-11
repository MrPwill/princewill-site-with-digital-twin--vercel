export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  skills?: string[];
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  credentialId?: string;
  skills?: string[];
  credentialUrl?: string;
  date?: string;
}

export interface Course {
  id: string;
  name: string;
  provider: string;
  date: string;
  credentialId?: string;
  skills?: string[];
  credentialUrl?: string;
}

export interface Skill {
  name: string;
  proficiency: number; // 0-100
  category: string;
}

export interface OpenSourceProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  highlights: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  photo: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  certificates: Certificate[];
  skills: Skill[];
  openSourceProjects: OpenSourceProject[];
}

export const profileData: ProfileData = {
  name: "Princewill C. Chioma",
  title: "AI Systems Engineer",
  location: "Lagos, Nigeria",
  photo: "/princewill.jpg",
  summary:
    "AI Systems Engineer specializing in building production-grade AI solutions using LLMs, Agentic AI, RAG pipelines, and low-code automation. Proven ability to bridge AI strategy and engineering to deliver scalable, revenue-impacting systems across finance, operations, and customer engagement.",
  experience: [
    {
      id: "exp-0",
      company: "Personal Projects Portfolio",
      role: "Creator & Developer",
      period: "2024 - Present",
      highlights: [
        "Built 6 production-grade AI applications: TxGuard AI, Slate PM, ClauseGuard Africa, AI SDR Platform, Digital Twin Agent, and Synthetic Data Generator",
        "Full-stack development with Next.js 15/16, TypeScript, Python/FastAPI, Supabase, and modern state management (Zustand)",
        "Implemented multi-agent orchestration pipelines with CrewAI, LangGraph, and custom architectures for autonomous workflows",
        "AI integration via OpenRouter and OpenAI APIs for task generation, document drafting, lead scoring, and conversational AI",
        "RAG-powered knowledge systems with vector databases and semantic search for intelligent document retrieval",
        "Real-time features: SSE streaming, Supabase Realtime for cross-client synchronization, local-first architecture with cloud sync",
        "Secure authentication and authorization with Supabase Auth, Row Level Security (RLS) policies, and signed storage URLs",
        "Multi-jurisdiction support with jurisdiction-aware legal document generation for Nigeria, Kenya, Ghana, and South Africa",
        "PDF generation with @react-pdf/renderer, digital signatures via react-signature-canvas, and branded document exports",
        "Webhook-driven integrations for CRM updates, email automation via SendGrid, and conversation management",
        "Function-calling AI agents with GPT-4 for order tracking, ticket management, and profile updates",
        "Self-correcting agent loops: Generator → Judge → Refiner with strict JSON schema validation using Pydantic",
        "Gradio UI development for interactive AI configuration, data visualization, and user-friendly controls",
        "Database design with SQLite, SQLAlchemy ORM, and persistent storage for auditability and run history",
      ],
    },
    {
      id: "exp-1",
      company: "Stardom Financial Services Limited",
      role: "AI Engineer",
      period: "September 2024 - Present",
      highlights: [
        "Designed and deployed autonomous AI agents for financial monitoring, reporting automation, and operational workflows",
        "Built enterprise RAG systems that enable business users to query internal documentation instantly",
        "Developed agentic workflows using n8n to automate CRM updates, reporting pipelines, and notifications",
        "Implemented production voice AI systems using ElevenLabs",
        "Integrated AI systems with Google Sheets, APIs, Slack, WhatsApp, and email tools",
        "Building multi-agent financial analyst systems using MCP + AWS Bedrock",
      ],
    },
    {
      id: "exp-2",
      company: "Extreme Tech Svcs Limited",
      role: "Software Engineer",
      period: "March 2021 - August 2024",
      highlights: [
        "Built and deployed 5+ full-stack applications for SMEs using Python, FastAPI, Next.js, TypeScript, JavaScript, and PostgreSQL",
        "Developed backend APIs for authentication, reporting, payments, and third-party integrations",
        "Reduced manual business processes by 35%",
        "Designed frontend dashboards that improved operational efficiency by 30%",
        "Improved API performance by 40%",
        "Reduced deployment time by 50% using Docker, GitHub Actions, and AWS",
      ],
    },
    {
      id: "exp-3",
      company: "BOCH Systems West Africa",
      role: "Business Operations & Finance Manager",
      period: "May 2016 - February 2021",
      highlights: [
        "Led financial modeling, forecasting, and strategic business analysis",
        "Reduced operational costs by 28% through data-driven optimization",
        "Increased productivity by 50% via workflow automation and process redesign",
        "Delivered analytics dashboards improving decision-making efficiency",
      ],
    },
    {
      id: "exp-4",
      company: "GTBank",
      role: "Internal Control/Audit",
      period: "July 2013 - April 2016",
      highlights: [
        "Conducted AML audits and compliance reviews",
        "Prepared regulatory reporting for CBN/NFIU",
        "Conducted internal audits and sweeps of departments",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of the People",
      degree: "Bachelor's degree",
      field: "Computer Science",
    },
    {
      id: "edu-2",
      institution: "WorldQuant University",
      degree: "Certificate",
      field: "Applied Data Science Lab",
      skills: ["Data Cleaning", "SQL", "Python", "Statistics", "Machine Learning", "Data Visualization", "Predictive Modeling", "Statistical Analysis", "Feature Engineering"],
    },
    {
      id: "edu-3",
      institution: "ACCA",
      degree: "Advanced Diploma",
      field: "Accounting and Business",
    },
    {
      id: "edu-4",
      institution: "The Federal Polytechnic Nekede, Owerri",
      degree: "HND",
      field: "Secretarial Administration",
    },
    {
      id: "edu-5",
      institution: "Institute for Customer Relationship Management",
      degree: "Professional PGD",
      field: "Customer Relationship and Management",
    },
  ],
  certificates: [
    {
      id: "cert-1",
      name: "Certificate in Network and Application Security",
      issuer: "University of the People",
      credentialUrl: "Certificate_UoPeople.pdf",
    },
    {
      id: "cert-2",
      name: "Certified AI Fundamentals",
      issuer: "DataCamp",
      credentialId: "AIF0020038125681",
    },
    {
      id: "cert-3",
      name: "Associate Data Engineer in SQL",
      issuer: "DataCamp",
    },
    {
      id: "cert-4",
      name: "ChatGPT Prompt Engineering for Developers",
      issuer: "DeepLearning.AI",
      skills: ["Prompt Engineering", "Chatbot Development"],
    },
    {
      id: "cert-5",
      name: "Explore a Career in Data Engineering",
      issuer: "LinkedIn",
    },
    {
      id: "cert-6",
      name: "AI Engineering Essentials: Navigating the Tech Revolution",
      issuer: "LinkedIn",
      skills: ["Software Development", "Artificial Intelligence (AI)"],
    },
    {
      id: "course-1",
      name: "AI Coder: Complete Claude Code & Coding Agents Course",
      issuer: "Udemy",
      date: "Apr 2026",
    },
    {
      id: "course-2",
      name: "Building AI Agents with Google ADK",
      issuer: "DataCamp",
      date: "Feb 2026",
      skills: ["AI Agents", "Google Agent Development Kit (ADK)"],
    },
    {
      id: "course-3",
      name: "AI Builder with n8n: Create Agents & Voice Agents",
      issuer: "Udemy",
      date: "Jan 2026",
      skills: ["Low-Code AI Development (n8n Workflow Automation)", "Agentic Voice AI (Voice Agent Engineering, ElevenLabs Integration)", "AI Automation", "Workflow Design", "API Integration"],
    },
    {
      id: "course-4",
      name: "AI Leadership Track: Gen AI, Agentic AI for Business Leaders",
      issuer: "Udemy",
      date: "Jan 2026",
      credentialId: "UC-6ea84601-9862-422d-99b3-f202c2791952",
      skills: ["Strategic AI Leadership", "Commercial AI Decision-Making", "AI Strategy"],
    },
    {
      id: "course-5",
      name: "AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents",
      issuer: "Udemy",
      date: "Jan 2026",
      credentialId: "UC-d7cdd56f-7154-4921-b004-4a12835db26e",
      skills: ["Large Language Models (LLM)", "Retrieval-Augmented Generation (RAG)", "Fine-tuning", "Prompt Engineering", "Agentic AI", "QLoRA", "Vector Databases", "LLM Deployment", "Model Optimization"],
    },
  ],
  skills: [
    { name: "Python", proficiency: 95, category: "AI/LLM" },
    { name: "RAG Pipelines", proficiency: 92, category: "AI/LLM" },
    { name: "Fine-tuning (QLoRA)", proficiency: 88, category: "AI/LLM" },
    { name: "Vector Databases", proficiency: 85, category: "AI/LLM" },
    { name: "Google ADK", proficiency: 92, category: "Agentic" },
    { name: "CrewAI", proficiency: 92, category: "Agentic" },
    { name: "LangGraph", proficiency: 90, category: "Agentic" },
    { name: "AutoGen", proficiency: 88, category: "Agentic" },
    { name: "OpenAI Agents SDK", proficiency: 90, category: "Agentic" },
    { name: "AWS (Bedrock, SageMaker)", proficiency: 85, category: "MLOps/Cloud" },
    { name: "Docker", proficiency: 90, category: "MLOps/Cloud" },
    { name: "Terraform", proficiency: 80, category: "MLOps/Cloud" },
    { name: "FastAPI", proficiency: 92, category: "Python & Code" },
    { name: "SQL", proficiency: 85, category: "Python & Code" },
    { name: "N8N / Zapier", proficiency: 88, category: "Automation" },
    { name: "ElevenLabs", proficiency: 90, category: "Automation" },
    { name: "Financial Services", proficiency: 85, category: "Domain" },
    { name: "Regulatory Compliance (AML, CBN, NFIU)", proficiency: 80, category: "Domain" },
  ],
  openSourceProjects: [
    {
      id: "oss-1",
      name: "TxGuard AI",
      description: "Intelligent Fraud Detection & Autonomous Investigation Platform for real-time transaction monitoring",
      techStack: ["FastAPI", "Next.js", "Python", "Scikit-learn", "CrewAI", "PostgreSQL", "Redis", "Celery", "ChromaDB", "Docker", "Terraform", "Google Cloud Run"],
      githubUrl: "https://github.com/MrPwill/txguard",
      highlights: [
        "Hybrid risk engine with Isolation Forest + LOF anomaly models (<200ms)",
        "CrewAI multi-agent investigation workflow for compliance and fraud patterns",
        "Explainable AI (XAI) using SHAP values for transparent risk scoring",
        "Real-time monitoring dashboard with WebSocket alerts and audit logs",
      ],
    },
    {
      id: "oss-2",
      name: "Slate PM",
      description: "Professional Kanban project management tool with AI-powered task generation, complexity analysis, and real-time collaboration",
      techStack: ["Next.js 15", "TypeScript", "Supabase", "OpenRouter", "Zustand", "Tailwind CSS 4"],
      githubUrl: "https://github.com/MrPwill/slate-pm",
      liveUrl: "https://slate-pm.vercel.app",
      highlights: [
        "5-column Kanban workflow with local-first architecture",
        "AI task generation transforms goals into granular actionable items",
        "Supabase Realtime for instant cross-client synchronization",
        "Row Level Security (RLS) policies for data isolation",
      ],
    },
    {
      id: "oss-3",
      name: "ClauseGuard Africa",
      description: "Jurisdiction-aware legal document generation platform for freelancers, startups, and SMEs across African markets",
      techStack: ["Next.js 16", "TypeScript", "Supabase", "OpenRouter", "@react-pdf/renderer"],
      githubUrl: "https://github.com/MrPwill/clause_guard",
      liveUrl: "https://clause-guard-chi.vercel.app",
      highlights: [
        "Multi-jurisdiction support: Nigeria, Kenya, Ghana, South Africa",
        "AI-powered questionnaire converts plain language to legal documents",
        "E-signatures with react-signature-canvas and PDF export",
        "RLS ensures users only access their own documents",
      ],
    },
    {
      id: "oss-4",
      name: "AI SDR Platform",
      description: "Production-grade autonomous outbound revenue engine with multi-agent architecture for lead generation and email automation",
      techStack: ["Python 3.12", "OpenAI", "SendGrid", "Serper API", "SQLite"],
      githubUrl: "https://github.com/MrPwill/ai_sdr_agent",
      highlights: [
        "6-agent pipeline: Lead Researcher → ICP Scorer → Sales Manager → Email Manager",
        "Webhook-driven reply classification and conversation management",
        "ICP scoring against configurable rules in YAML",
        "Guardrails for input validation and output safety",
      ],
    },
    {
      id: "oss-5",
      name: "Synthetic Data Generator",
      description: "Multi-agent platform for generating, validating, and refining high-quality synthetic datasets",
      techStack: ["Python 3.12", "Gradio", "OpenRouter", "Pydantic", "SQLAlchemy"],
      githubUrl: "https://github.com/MrPwill/pwill_synthetic_data_generator",
      highlights: [
        "Self-correcting agent loop: Generator → Judge → Refiner",
        "Multi-model support via OpenRouter (Llama, Mistral, DeepSeek, Qwen)",
        "JSON schema validation with logical correctness checks",
        "SQLite persistence for auditability and run history",
      ],
    },
    {
      id: "oss-6",
      name: "AI Customer Support Agent",
      description: "Intelligent function-calling AI agent for handling support queries, order management, and ticket processing",
      techStack: ["Python", "FastAPI", "OpenAI GPT-4", "SQLite"],
      githubUrl: "https://github.com/MrPwill/AI-Customer-Support-Agent",
      highlights: [
        "Real-time order status checking with shipping details",
        "Support ticket creation and status tracking",
        "User profile updates with secure execution",
        "Function calling with structured JSON output",
      ],
    },
  ],
};