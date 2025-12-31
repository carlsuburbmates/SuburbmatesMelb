import { Container } from '@/components/layout/Container';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <Container className="max-w-3xl">
        <article className="prose prose-gray max-w-none">
          {children}
        </article>
      </Container>
    </div>
  );
}
