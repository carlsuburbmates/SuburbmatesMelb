import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/button';
import React from 'react';

describe('Button Component', () => {
  it('renders loading spinner when isLoading is true', () => {
    const html = renderToStaticMarkup(
      <Button isLoading={true}>Test</Button>
    );

    expect(html).toContain('animate-spin');
    expect(html).toContain('disabled');
    expect(html).toContain('aria-busy="true"');
  });

  it('does not render loading spinner when isLoading is false', () => {
    const html = renderToStaticMarkup(
      <Button isLoading={false}>Test</Button>
    );

    expect(html).not.toContain('animate-spin');
    expect(html).not.toContain('aria-busy="true"');
  });
});
