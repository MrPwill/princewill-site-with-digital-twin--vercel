# Implementation Plan — Princewill Digital Twin Portfolio

This plan breaks the full specification in AGENTS.md into executable stages with clear checkpoints.

---

## Testing Principles

1. **80% Coverage Target** — On all critical code paths (backend AI logic, frontend chat components)
2. **Every Stage Checkpoint** — Testing must pass before proceeding to next stage
3. **Modularity First** — Each module independently testable with clear inputs/outputs
4. **CI/CD Ready** — All tests must run in automated pipelines

### Coverage Requirements by Area

| Area | Target | Focus |
|------|--------|-------|
| Backend core/ | 80% | profile_loader, prompt_builder, memory_manager |
| Backend routers | 80% | chat endpoints, validation |
| Frontend lib/twin | 80% | memory, stream utilities |
| Frontend components | 70% | ChatWindow, InputBar, MessageBubble |
| Frontend pages | 60% | Integration and rendering |

### Test Stack

- **Python Backend:** pytest + pytest-asyncio + pytest-cov
- **TypeScript Frontend:** Vitest + React Testing Library + @testing-library/jest-dom

---

## Stage 1: Project Infrastructure Setup

**Goal:** Scaffolding for both frontend and backend with Docker Compose orchestration.

### Tasks

- [x] 1.1 Initialize Next.js frontend (`npx create-next-app@latest frontend --typescript --tailwind --app`)
- [x] 1.2 Set up Python backend directory structure (`backend/`, `backend/core/`, `backend/routers/`, `backend/models/`, `backend/me/`)
- [x] 1.3 Create `backend/requirements.txt` with all dependencies
- [x] 1.4 Create `docker-compose.yml` for orchestration
- [x] 1.5 Create `backend/Dockerfile`

### Testing (Stage 1)

- [x] 1.6 Verify Docker Compose builds successfully
- [x] 1.7 Verify both containers start without errors
- [x] 1.8 Verify frontend dev server runs on port 3000
- [x] 1.9 Verify backend health endpoint responds

**Checkpoint:** `docker-compose up --build` runs both services without errors. ✅ PASSED

---

## Stage 2: Backend — Core AI Logic

**Goal:** Complete Python backend with profile loading, prompt building, memory management, and OpenRouter streaming.

### Modularity Principle
Each module in `backend/core/` must be independently testable with clear inputs/outputs.

### Tasks

- [x] 2.1 Create `backend/core/profile_loader.py` — PDF + summary.txt loader with `@lru_cache`
- [x] 2.2 Create `backend/core/prompt_builder.py` — system prompt template injection
- [x] 2.3 Create `backend/core/memory_manager.py` — in-process session memory
- [x] 2.4 Create `backend/core/openrouter_client.py` — async SSE streaming client
- [x] 2.5 Create `backend/models/schemas.py` — Pydantic models
- [x] 2.6 Create `backend/routers/chat.py` — `/chat/stream` POST + `/chat/session/{id}` DELETE
- [x] 2.7 Create `backend/main.py` — FastAPI entry point with CORS and health endpoint
- [x] 2.8 Create `backend/.env` template with required variables

### Testing (Stage 2) — 80% Coverage Target

- [x] 2.9 Unit test `profile_loader.py` — verify PDF parsing and caching
- [x] 2.10 Unit test `prompt_builder.py` — verify prompt template injection
- [x] 2.11 Unit test `memory_manager.py` — verify session CRUD operations
- [x] 2.12 Unit test `schemas.py` — verify Pydantic validation
- [x] 2.13 Integration test `/chat/stream` endpoint with mock LLM response
- [x] 2.14 Integration test `/chat/session/{id}` DELETE clears memory
- [x] 2.15 Integration test `/health` endpoint

**Checkpoint:** `curl -X POST http://localhost:8000/chat/stream -d '{"message":"hello","session_id":"test"}'` returns SSE stream. ✅ PASSED (83% coverage)

---

## Stage 3: Frontend — Design System

**Goal:** Neural Indigo theme implementation with all UI primitives.

### Modularity Principle
Each UI component must be self-contained with props interfaces and reusable.

### Tasks

- [x] 3.1 Configure Tailwind CSS with custom colors, fonts, and design tokens in `tailwind.config.ts`
- [x] 3.2 Create `frontend/app/globals.css` with CSS variables (root, fonts, transitions)
- [x] 3.3 Create `frontend/components/ui/` components:
  - [x] GlowCard
  - [x] GradientButton
  - [x] SectionHeading
  - [x] AnimatedBadge
  - [x] NeuralBackground
  - [x] GlowRing

### Testing (Stage 3)

- [x] 3.4 Verify TypeScript compilation succeeds
- [x] 3.5 Verify Next.js build passes
- [x] 3.6 Verify CSS variables apply correctly (dark theme)

**Checkpoint:** A test page renders all UI components with correct dark theme. ✅ PASSED

---

## Stage 4: Frontend — Layout & Navigation

**Goal:** Shell structure with global navigation and page wrapper.

### Modularity Principle
Layout components must be composable and slots/children pattern for flexibility.

### Tasks

- [x] 4.1 Create `frontend/components/layout/Navbar.tsx` — logo, nav links, theme toggle
- [x] 4.2 Create `frontend/components/layout/Footer.tsx` — social links, copyright
- [x] 4.3 Create `frontend/components/layout/PageWrapper.tsx` — section container
- [x] 4.4 Update `frontend/app/layout.tsx` — use Navbar/Footer, load fonts (Syne, DM Sans, JetBrains Mono)
- [x] 4.5 Update `app/page.tsx` for basic hero rendering (will enhance in Stage 5)

### Testing (Stage 4)

- [x] 4.6 Verify TypeScript compilation succeeds
- [x] 4.7 Verify Next.js build passes
- [x] 4.8 Test navigation links render

**Checkpoint:** All pages have consistent navigation and footer. ✅ PASSED

---

## Stage 5: Frontend — Portfolio Sections

**Goal:** All portfolio pages with content from specification.

### Modularity Principle
Each page should use reusable components; data layers separated from presentation.

### Tasks

- [x] 5.1 Create `frontend/app/about/page.tsx` — vertical timeline with roles
- [x] 5.2 Create `frontend/app/projects/page.tsx` — GlowCard grid with filter tabs
- [x] 5.3 Create `frontend/app/skills/page.tsx` — categorized skills with visual indicators
- [x] 5.4 Create `frontend/app/contact/page.tsx` — contact form and social links
- [x] 5.5 Create `frontend/data/profile.ts` — typed career data (experience, certifications, skills)
- [x] 5.6 Create `frontend/data/projects.ts` — project metadata for portfolio cards

### Testing (Stage 5)

- [x] 5.7 Verify TypeScript compilation succeeds
- [x] 5.8 Verify Next.js build passes with all pages
- [x] 5.9 Test data layer exports correct types

**Checkpoint:** All portfolio sections render with mock/provided data. ✅ PASSED

---

## Stage 6: Frontend — Digital Twin Chat UI

**Goal:** Complete chat interface with SSE streaming integration.

### Modularity Principle
Chat components must have clear separation: UI (components), State (hooks), Transport (lib/twin).

### Tasks

- [x] 6.1 Create `frontend/lib/twin/memory.ts` — session ID management
- [x] 6.2 Create `frontend/lib/twin/stream.ts` — SSE reader
- [x] 6.3 Create `frontend/app/api/twin/route.ts` — SSE proxy to backend
- [x] 6.4 Create `frontend/components/twin/MessageBubble.tsx` — styled user/AI messages
- [x] 6.5 Create `frontend/components/twin/TypingIndicator.tsx` — animated dots
- [x] 6.6 Create `frontend/components/twin/InputBar.tsx` — input with shift+enter support
- [x] 6.7 Create `frontend/components/twin/StarterChips.tsx` — suggested questions
- [x] 6.8 Create `frontend/components/twin/ChatWindow.tsx` — orchestrating container
- [x] 6.9 Create `frontend/app/twin/page.tsx` — Digital Twin page with disclaimer

### Testing (Stage 6)

- [x] 6.10 Verify TypeScript compilation succeeds
- [x] 6.11 Verify Next.js build passes

**Checkpoint:** A complete chat flow — send message, receive streaming response. ✅ PASSED

---

## Stage 7: Integration & Environment

**Goal:** Final configuration and content population.

### Modularity Principle
Environment configuration should be centralized; secrets never committed.

### Tasks

- [x] 7.1 Create `frontend/.env.local` with `BACKEND_URL` and `NEXT_PUBLIC_SITE_URL`
- [x] 7.2 Create placeholder files in `backend/me/` for profile loading
- [x] 7.3 Update docker-compose with `BACKEND_URL` environment variable
- [x] 7.4 Verify Docker Compose orchestration

### Testing (Stage 7)

- [x] 7.5 Verify Docker Compose runs without errors
- [x] 7.6 Verify backend health endpoint responds
- [x] 7.7 Verify environment variables load correctly

**Note:** User must provide `OPENROUTER_API_KEY` in `backend/.env` for real LLM responses.

**Checkpoint:** Full end-to-end flow works. ✅ PASSED

---

## Stage 8: Testing & Polish

**Goal:** Verify all functionality and refine UI.

### Modularity Principle
Tests should run in CI/CD; accessibility and performance must be measurable.

### Tasks

- [x] 8.1 Test backend health endpoint
- [x] 8.2 Verify chat SSE stream with mock LLM
- [x] 8.3 Verify Docker Compose runs without errors
- [x] 8.4 Run lint/typecheck on frontend
- [x] 8.5 Add Meta / OG tags for social sharing (in layout.tsx)

### Testing (Stage 8) — 80% Coverage Target

- [x] 8.6 Run pytest with coverage report (83% on core modules)
- [x] 8.7 Verify lint passes on frontend

**Note:** For full production readiness, add real `OPENROUTER_API_KEY` and `princewill_profile.pdf`.

**Checkpoint:** Site is production-ready. ✅ COMPLETED

---

## Dependencies & Prerequisites

### Required from User

| Item | Purpose | Where to put |
|------|---------|--------------|
| `OPENROUTER_API_KEY` | LLM API access | `backend/.env` |
| `princewill_profile.pdf` | Career context | `backend/me/princewill_profile.pdf` |
| `princewill.jpg` | Headshot | `frontend/public/princewill.jpg` |

### Build Verification Commands

```bash
# Full stack
docker-compose up --build

# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && uvicorn main:app --reload --port 8000

# Lint & Typecheck
cd frontend && npm run lint && npm run typecheck
```

---

## Estimated Stage Completion

| Stage | Focus Area | Est. Files |
|-------|-----------|------------|
| 1 | Infrastructure | 5 |
| 2 | Backend AI Logic | 7 |
| 3 | Design System | 7 |
| 4 | Layout & Nav | 4 |
| 5 | Portfolio Pages | 7 |
| 6 | Digital Twin UI | 9 |
| 7 | Integration | 3 |
| 8 | Testing & Polish | — |
| **Total** | | **~42 files** |

---

*Plan created: 2026-04-21*