# Princewill Personal Portfolio with Digital Twin

## Overview
A modern, high-performance personal portfolio website featuring a "Digital Twin" - an interactive AI assistant that represents Princewill and answers questions about his experience, projects, and skills. Built with a full-stack architecture combining a Next.js frontend and a FastAPI Python backend.

## Features
- **Interactive Digital Twin**: An AI-powered chatbot that simulates conversation with Princewill, providing insights into his professional background, projects, and technical skills.
- **Project Showcase**: Detailed overviews of key projects including Slate PM, ClauseGuard Africa, AI SDR Platform, Synthetic Data Generator, and more.
- **Modern UI/UX**: Designed with Tailwind CSS v4 and Framer Motion for smooth animations and a premium, responsive user experience.
- **Streaming Responses**: Real-time streaming of AI responses using Server-Sent Events (SSE) for a seamless chat experience.

## Tech Stack

### Frontend
- Next.js 16.2.4 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion
- React Markdown
- TypeScript

### Backend (Digital Twin API)
- Python
- FastAPI
- Uvicorn
- PyPDF
- Pydantic
- HTTPX

## Prerequisites
- Node.js (v20 or higher recommended)
- Python 3.10+
- npm, yarn, or pnpm
- Required API keys for the Digital Twin backend (e.g., OpenAI or OpenRouter API keys)

## Getting Started

### 1. Repository Setup
Clone the repository to your local machine:
```bash
git clone <repository-url>
cd princewill-site-with-digital-twin
```

### 2. Backend Setup (FastAPI)
Set up your Python virtual environment and install the required dependencies:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the root directory for your backend variables:
```env
# Example environment variables
# OPENAI_API_KEY=your_api_key_here
```

Start the FastAPI development server:
```bash
uvicorn main:app --reload --port 8000
```
Note: The frontend expects the local backend to be running on port 8000 during development.

### 3. Frontend Setup (Next.js)
In a new terminal window, install the Next.js frontend dependencies:
```bash
npm install
```

Create a `.env.local` file for any frontend-specific environment variables.

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Architecture & Routing
The frontend communicates with the Python backend through Next.js API routes (e.g., `/api/twin`). During development, requests made to the Next.js API are automatically proxied to the local Python backend running on `127.0.0.1:8000`. In production, these requests are routed to the deployed backend service URL.

## License
MIT License
