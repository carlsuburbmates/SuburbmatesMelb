import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render children correctly', () => {
    const html = renderToStaticMarkup(<Button>Click me</Button>);
    expect(html).toContain('Click me');
    expect(html).not.toContain('animate-spin');
  });

  it('should render loading spinner when isLoading is true', () => {
    const html = renderToStaticMarkup(<Button isLoading>Click me</Button>);
    expect(html).toContain('animate-spin'); // Check for spinner class
    expect(html).toContain('disabled=""'); // Check for disabled attribute
    expect(html).toContain('aria-busy="true"'); // Check for aria-busy
  });

  it('should NOT render spinner when asChild is true', () => {
    const html = renderToStaticMarkup(
      <Button asChild isLoading>
        <a href="/test">Link</a>
      </Button>
    );
    // When asChild is true, it renders the child element (a tag)
    // The spinner logic should be skipped to prevent Slot errors
    expect(html).toContain('<a href="/test"');
    expect(html).not.toContain('animate-spin');
  });
});
