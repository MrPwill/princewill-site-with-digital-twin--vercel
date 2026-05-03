"use client";

import Link from "next/link";
import { profileData } from "@/data/profile";
import { GradientButton } from "@/components/ui/GradientButton";
import { AnimatedBadge } from "@/components/ui/AnimatedBadge";
import { GlowRing } from "@/components/ui/GlowRing";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(109,74,255,0.12)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(46,168,255,0.08)_0%,transparent_55%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <AnimatedBadge variant="pulse" color="gold" className="mb-6">
              <span className="w-2 h-2 bg-[var(--gold-accent)] rounded-full animate-pulse" />
              Available for Projects
            </AnimatedBadge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-[var(--text-primary)]">Hi, I&apos;m </span>
              <span className="bg-gradient-to-r from-[var(--blue-primary)] to-[var(--sky-blue)] bg-clip-text text-transparent">
                Princewill C. Chioma
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-[var(--text-secondary)] mb-8 font-medium">
              AI Systems Engineer
            </p>
            
            <p className="text-lg text-[var(--text-muted)] mb-8 max-w-xl mx-auto lg:mx-0">
              Building production AI systems with Python. Expert in Multi-Agent Orchestration, 
              RAG Pipelines, and MLOps. Based in Lagos, Nigeria.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/twin">
                <GradientButton variant="primary" size="lg">
                  Chat With My Digital Twin
                </GradientButton>
              </Link>
              <Link href="/projects">
                <GradientButton variant="ghost" size="lg">
                  View Projects
                </GradientButton>
              </Link>
            </div>
          </div>

          {/* Right Content - Avatar */}
          <div className="flex-shrink-0">
            <GlowRing size="xl" color="sky">
              <img
                src={profileData.photo}
                alt={profileData.name}
                className="w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-full"
              />
            </GlowRing>
          </div>
        </div>
      </div>
    </section>
  );
}