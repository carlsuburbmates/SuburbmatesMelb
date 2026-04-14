import { Container } from '@/components/layout/Container';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen py-16 md:py-24" style={{ background: "var(--bg-base)" }}>
      <Container className="max-w-3xl">
        <article className="prose prose-invert prose-headings:font-display prose-headings:tracking-tight prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-li:text-[var(--text-secondary)] prose-strong:text-[var(--text-primary)] prose-a:text-[#6C5CE7] prose-a:no-underline hover:prose-a:underline max-w-none">
          {children}
        </article>
      </Container>
    </div>
  );
}
