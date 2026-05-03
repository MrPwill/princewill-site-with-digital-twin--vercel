import { profileData, Skill } from "@/data/profile";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlowCard } from "@/components/ui/GlowCard";

const categories = [
  "AI/LLM",
  "Agentic",
  "MLOps/Cloud",
  "Python & Code",
  "Automation",
  "Domain",
];

function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-[var(--text-primary)] font-medium">{skill.name}</span>
        <span className="text-[var(--text-muted)] text-sm">{skill.proficiency}%</span>
      </div>
      <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--blue-primary)] to-[var(--indigo-secondary)] rounded-full transition-all duration-500"
          style={{ width: `${skill.proficiency}%` }}
        />
      </div>
    </div>
  );
}

function SkillCategory({
  category,
  skills,
}: {
  category: string;
  skills: Skill[];
}) {
  return (
    <GlowCard>
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">{category}</h3>
      {skills.map((skill) => (
        <SkillBar key={skill.name} skill={skill} />
      ))}
    </GlowCard>
  );
}

export default function SkillsPage() {
  const skillsByCategory = categories.map((category) => ({
    category,
    skills: profileData.skills.filter((s) => s.category === category),
  }));

  return (
    <PageWrapper>
      <SectionHeading
        title="Skills"
        subtitle="Technical expertise across AI, cloud, and domain knowledge"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillsByCategory.map(({ category, skills }) => (
          <SkillCategory key={category} category={category} skills={skills} />
        ))}
      </div>
    </PageWrapper>
  );
}