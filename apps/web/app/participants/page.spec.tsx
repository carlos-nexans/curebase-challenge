import { describe, it, expect, vi, afterEach, afterAll, Mock } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import ParticipantsPage from './page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { graphqlClient } from '../queryClient'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock graphql client
vi.mock('../queryClient', () => ({
  graphqlClient: {
    request: vi.fn(),
  },
}))

describe('ParticipantsPage', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  afterEach(() => {
    cleanup()
  })

  afterAll(() => {
    vi.clearAllMocks()
  })

  it('displays list of participants when data is loaded', async () => {
    const mockParticipants = {
      participants: [
        { 
          id: '1', 
          name: 'John Doe', 
          enrolledAt: '2024-03-15T10:00:00Z'
        },
        { 
          id: '2', 
          name: 'Jane Smith', 
          enrolledAt: '2024-03-16T11:00:00Z'
        },
      ],
    } as any

    (graphqlClient.request as Mock).mockResolvedValueOnce(mockParticipants)

    render(<ParticipantsPage />, { wrapper: createWrapper() })

    // Verify loading state is shown initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Wait for and verify participant data
    expect(await screen.findByText('John Doe')).toBeInTheDocument()
    expect(await screen.findByText('Jane Smith')).toBeInTheDocument()
    
    // Verify enrollment dates are formatted correctly
    expect(screen.getByText('Enrolled in March 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('Enrolled in March 16, 2024')).toBeInTheDocument()

    // Verify "Enroll a participant" button exists
    expect(screen.getByText('Enroll a participant')).toBeInTheDocument()
  })

  it('shows loading state when participants are being fetched', () => {
    (graphqlClient.request as Mock).mockImplementationOnce(() => new Promise(() => {})) // Never resolves

    render(<ParticipantsPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByText('Participants')).toBeInTheDocument()
  })

  it('shows error message when fetch fails', async () => {
    (graphqlClient.request as Mock).mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<ParticipantsPage />, { wrapper: createWrapper() })

    expect(await screen.findByText('Error loading participants')).toBeInTheDocument()
    expect(screen.getByText('Participants')).toBeInTheDocument()
  })

  it('displays empty state when no participants exist', async () => {
    const mockParticipants = {
      participants: [],
    } as any

    (graphqlClient.request as Mock).mockResolvedValueOnce(mockParticipants)

    render(<ParticipantsPage />, { wrapper: createWrapper() })

    // Wait for loading to complete
    await screen.findByText('No participants enrolled yet')

    // Verify empty state message
    expect(screen.getByText('No participants enrolled yet')).toBeInTheDocument()

    // Verify "Enroll a participant" button is still visible
    expect(screen.getByText('Enroll a participant')).toBeInTheDocument()
  })
})