import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const html = renderToStaticMarkup(<Button>Click me</Button>);
    expect(html).toContain('Click me');
    expect(html).toContain('button');
  });

  it('renders loading state correctly', () => {
    const html = renderToStaticMarkup(<Button isLoading>Loading...</Button>);

    // Check for disabled attribute
    expect(html).toContain('disabled=""');

    // Check for spinner class (animate-spin) or Loader2
    // Since we don't know the exact SVG output of Loader2, we look for the class we add: "animate-spin"
    expect(html).toContain('animate-spin');

    // Check that children are still rendered
    expect(html).toContain('Loading...');
  });

  it('does not render spinner when asChild is true', () => {
    const html = renderToStaticMarkup(<Button asChild isLoading><span>Child</span></Button>);

    expect(html).not.toContain('animate-spin');
    expect(html).toContain('Child');
  });
});
