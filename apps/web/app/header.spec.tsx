import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import NavigationHeader from './header'

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />
}))

describe('NavigationHeader', () => {
  afterEach(() => {
    cleanup()
  })

  const mockNavigationItems = [
    { href: '/trials', label: 'Trials' },
    { href: '/participants', label: 'Participants' },
    { href: '/settings', label: 'Settings' }
  ]

  it('renders the logo with correct props', () => {
    render(
      <NavigationHeader 
        logoSrc="/test-logo.svg"
        logoAlt="Test Logo"
        navigationItems={mockNavigationItems}
      />
    )

    const logo = screen.getByAltText('Test Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/test-logo.svg')
  })

  it('renders all navigation items correctly', () => {
    render(
      <NavigationHeader 
        logoSrc="/test-logo.svg"
        logoAlt="Test Logo"
        navigationItems={mockNavigationItems}
      />
    )

    mockNavigationItems.forEach(item => {
      const link = screen.getByText(item.label)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', item.href)
    })
  })

  it('uses placeholder logo when logoSrc is not provided', () => {
    render(
      <NavigationHeader 
        logoSrc=""
        logoAlt="Test Logo"
        navigationItems={mockNavigationItems}
      />
    )

    const logo = screen.getByAltText('Test Logo')
    expect(logo).toHaveAttribute('src', '/placeholder.svg')
  })
})