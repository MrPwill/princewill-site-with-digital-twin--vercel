"use client";

import { useState } from "react";
import { projects, ProjectTrack, Project } from "@/data/projects";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlowCard } from "@/components/ui/GlowCard";

function ProjectCard({ project }: { project: Project }) {
  return (
    <GlowCard glowColor={project.flagship ? "gold" : "sky"} className="relative">
      {project.flagship && (
        <div className="absolute -top-3 -right-3">
          <span className="px-2 py-1 text-xs font-bold bg-[var(--gold-accent)] text-[var(--bg-base)] rounded-full">
            ★ Flagship
          </span>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            {project.name}
          </h3>
          <p className="text-[var(--text-secondary)]">{project.description}</p>
        </div>
        
        {/* Highlights */}
        <ul className="space-y-1">
          {project.highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
              <span className="text-[var(--blue-primary)] mt-0.5">▹</span>
              {highlight}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded border border-[var(--border-subtle)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--blue-primary)] hover:underline text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          )}
          {project.production && (
            <a
              href={project.production}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--gold-accent)] hover:underline text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.6c-.11-.21-.21-.43-.21-.79 0-4.08 3.05-7.44 7-7.93V15c-1.1 0-2 .9-2 2v.93z"/>
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </GlowCard>
  );
}

export default function ProjectsPage() {
  const [activeTrack, setActiveTrack] = useState<ProjectTrack>("All");

  const filteredProjects =
    activeTrack === "All"
      ? projects
      : projects.filter((p) => p.track === activeTrack);

  return (
    <PageWrapper>
      <SectionHeading
        title="Projects"
        subtitle="Production AI systems built with Python, demonstrating real-world impact"
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(["All", "LLM/RAG", "Agentic", "MLOps", "Automation"] as ProjectTrack[]).map(
          (track) => (
            <button
              key={track}
              onClick={() => setActiveTrack(track)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  activeTrack === track
                    ? "bg-[var(--indigo-secondary)] text-white shadow-[var(--glow-indigo)]"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              {track}
            </button>
          )
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <p className="text-center text-[var(--text-muted)] py-12">
          No projects found in this category.
        </p>
      )}
    </PageWrapper>
  );
}