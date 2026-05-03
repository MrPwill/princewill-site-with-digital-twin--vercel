import { ChatWindow } from "@/components/twin/ChatWindow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function TwinPage() {
  return (
    <section className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto scroll-mt-0">
        <SectionHeading
          title="Chat With My Digital Twin"
          subtitle="Ask me anything about my experience, projects, or technical expertise"
        />
        
        <ChatWindow />
        
        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          AI representation of Princewill C. Chioma. 
          Direct:{" "}
          <a href="mailto:chiomaprincewillc@gmail.com" className="text-[var(--blue-primary)] hover:underline">
            chiomaprincewillc@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}