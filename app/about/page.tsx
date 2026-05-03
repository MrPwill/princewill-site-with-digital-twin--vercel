"use client";

import { profileData } from "@/data/profile";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlowCard } from "@/components/ui/GlowCard";
import { AnimatedBadge } from "@/components/ui/AnimatedBadge";

export default function AboutPage() {
  return (
    <PageWrapper>
      <SectionHeading
        title="About Me"
        subtitle="10+ years finance & ops × production AI engineering"
      />

      {/* Profile Summary Section */}
      <div className="mb-12 flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[var(--indigo-secondary)] shadow-[0_0_30px_rgba(109,74,255,0.4)]">
            <img
              src={profileData.photo}
              alt={profileData.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Summary Text */}
        <div className="flex-1">
          <GlowCard>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              {profileData.summary}
            </p>
          </GlowCard>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {profileData.experience.map((exp, index) => (
          <div key={exp.id} className="relative pl-8">
            {/* Timeline line */}
            {index < profileData.experience.length - 1 && (
              <div className="absolute left-3 top-8 bottom-0 w-px bg-gradient-to-b from-[var(--indigo-secondary)] to-transparent" />
            )}
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-[var(--indigo-secondary)] shadow-[var(--glow-indigo)]" />
            
            <GlowCard glowColor="sky" className="ml-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    {exp.role}
                  </h3>
                  <p className="text-[var(--blue-primary)]">{exp.company}</p>
                </div>
                <AnimatedBadge color="blue">{exp.period}</AnimatedBadge>
              </div>
              <ul className="space-y-2">
                {exp.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--gold-accent)] mt-1">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Education</h3>
        <div className="grid grid-cols-1 gap-4">
          {profileData.education.map((edu) => (
            <GlowCard key={edu.id} glowColor="gold">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--gold-accent)]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--gold-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--text-primary)]">{edu.institution}</h4>
                  <p className="text-[var(--text-secondary)]">{edu.degree}, {edu.field}</p>
                  {edu.skills && edu.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {edu.skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="px-2 py-1 text-xs bg-[var(--bg-elevated)] text-[var(--text-muted)] rounded">
                          {skill}
                        </span>
                      ))}
                      {edu.skills.length > 4 && (
                        <span className="px-2 py-1 text-xs bg-[var(--bg-elevated)] text-[var(--text-muted)] rounded">
                          +{edu.skills.length - 4} skills
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>

      {/* Certificates & Courses */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Courses with Certificate of Completion</h3>
        <div className="grid grid-cols-1 gap-4">
          {profileData.certificates
            .sort((a, b) => {
              if (a.date && b.date) {
                const dateA = new Date(a.date.replace(' ', ', ')).getTime();
                const dateB = new Date(b.date.replace(' ', ', ')).getTime();
                return dateB - dateA;
              }
              if (a.date) return -1;
              if (b.date) return 1;
              return 0;
            })
            .map((cert) => (
            <GlowCard key={cert.id} glowColor="blue">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--blue-primary)]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[var(--blue-primary)]">
                    {cert.issuer.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--text-primary)]">{cert.name}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {cert.issuer}
                    {cert.date && ` · Issued ${cert.date}`}
                  </p>
                  {cert.credentialId && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">Credential ID: {cert.credentialId}</p>
                  )}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cert.skills.map((skill) => (
                        <span key={skill} className="px-2 py-1 text-xs bg-[var(--bg-elevated)] text-[var(--text-muted)] rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}