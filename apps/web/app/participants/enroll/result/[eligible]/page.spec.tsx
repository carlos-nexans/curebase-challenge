import { describe, it, expect, vi, Mock, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import EligibilityResultPage from './page'
import { useRouter, useParams } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

describe('EligibilityResultPage', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('displays eligible content when param is eligible', () => {
    (useParams as Mock).mockImplementation(() => ({ eligible: 'eligible' }))
    
    render(<EligibilityResultPage />)
    
    expect(screen.getByText('Participant is eligible')).toBeInTheDocument()
    expect(screen.getByText('The participant can participate in this study.')).toBeInTheDocument()
    expect(screen.getByAltText('Success icon')).toBeInTheDocument()
  })

  it('displays not eligible content when param is not-eligible', () => {
    (useParams as Mock).mockImplementation(() => ({ eligible: 'not-eligible' }))
    
    render(<EligibilityResultPage />)
    
    expect(screen.getByText('Participant is not eligible')).toBeInTheDocument()
    expect(screen.getByText("The participant can't participate in this study.")).toBeInTheDocument()
    expect(screen.getByAltText('Error icon')).toBeInTheDocument()
  })

  it('navigates to participants page when OK button is clicked', async () => {
    (useParams as Mock).mockImplementation(() => ({ eligible: 'eligible' }))
    const mockRouter = { push: vi.fn() } as any
    (useRouter as Mock).mockReturnValue(mockRouter)
    
    render(<EligibilityResultPage />)

    // wait for mount
    const okButton = screen.getByText('OK')
    okButton.click()
    
    expect(mockRouter.push).toHaveBeenCalledWith('/participants')
  })
})