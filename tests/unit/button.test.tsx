
import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { Button } from '@/components/ui/button'

// @vitest-environment jsdom

describe('Button Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeDefined()
  })

  it('shows loading spinner when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>)

    // We expect the button to be disabled
    const button = screen.getByRole('button')
    // HTML disabled attribute existence check
    expect(button.hasAttribute('disabled')).toBe(true)
    expect(button.getAttribute('aria-busy')).toBe('true')

    // Check for spinner
    const spinner = button.querySelector('.animate-spin')
    expect(spinner).not.toBeNull()
  })
})
